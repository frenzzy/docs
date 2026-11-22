# IPv6-Only Host

**SWS** binds the default `::` host as a dual-stack socket, so it accepts IPv6 and IPv4 connections and also takes the port for IPv4.

The `--ipv6-only` option or its equivalent [SERVER_IPV6_ONLY](./../configuration/env.md#server-ipv6-only) env makes `::` accept IPv6 connections only and leaves the port free for IPv4, for example for another service listening on `0.0.0.0` at the same port. It is disabled by default.

```sh
static-web-server -d ./public/ --ipv6-only
```

Or in the [configuration file](./../configuration/file.md):

```toml
[general]
host = "::"
ipv6-only = true
```

## Behavior

- The option applies to the main listener and the [HTTP to HTTPS redirect](./http-https-redirect.md) listener.
- SWS fails to start if the OS refuses to make the socket IPv6-only.
- A specific IPv6 host, such as `::1`, always accepts IPv6 connections only, so the option has no effect on it.
- SWS fails to start when the option is combined with an IPv4 host, such as `0.0.0.0`, with [file descriptor socket passing](./file-descriptor-socket-passing.md) (`--fd`) or with a [Unix domain socket](./unix-domain-socket.md) (`--unix-socket`).
