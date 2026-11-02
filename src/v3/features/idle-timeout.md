# Idle Connection Timeout

**SWS** closes any connection on which no bytes have been read or written for the _idle timeout_.

This covers a client that:

- opens a connection but never sends a request,
- keeps a connection alive but sends no further requests,
- stops in the middle of a request,
- stops reading a response.

On HTTP/1, the whole request header must also arrive within the idle timeout, so a client can't keep a connection open by sending the header a byte at a time.

The timeout applies to every connection: HTTP/1, HTTP/2, TLS, the [HTTP to HTTPS redirect](./http-https-redirect.md) server and [Unix domain sockets](./unix-domain-socket.md).

Without a timeout, clients that disappear without closing their connections (for example, behind a NAT that dropped the mapping) would accumulate until the server ran out of file descriptors.

The feature is enabled by default and can be controlled by the numeric `--idle-timeout` option or its equivalent [SERVER_IDLE_TIMEOUT](./../configuration/env.md#server-idle-timeout) env.

> [!TIP] Tip
>
> The value is in seconds. The default is `30`, the maximum is `65535` (about 18 hours) and `0` disables the timeout.

Here is an example of closing connections after `60` seconds without any reads or writes.

```sh
static-web-server -d ./public/ --idle-timeout 60
```

## Behavior

- A download stays open for as long as data keeps moving, however long it takes. If the client reads nothing, or reads so slowly that nothing can be sent for the whole timeout, the connection is closed.
- If SWS can't start or continue a response within the timeout (for example, on very slow storage), the connection is closed too.
- Over TLS, only decrypted bytes count, so the TLS handshake must also finish within the timeout.

> [!TIP] Reverse proxies
>
> Reverse proxies keep idle connections to SWS open for longer than `30` seconds by default (nginx `60s`, Traefik `90s`, Caddy `2m`). If SWS closes one just as the proxy reuses it, the proxy retries the request on a new connection, but may log an error. To avoid this, set the proxy's upstream idle timeout below the SWS one.

> [!WARNING] Limitations
>
> A client can still keep a connection open indefinitely by making some progress within every timeout period, for example by sending a new request or reading part of a response. SWS doesn't limit the number of connections, so use a firewall or a reverse proxy if you need to limit connections per client.
