# Security Headers

**`SWS`** provides several [security headers](https://web.dev/security-headers/) support.

When the [HTTP/2](../features/http2-tls.md) feature is activated _security headers_ are enabled automatically, unless `--security-headers=false` is set via CLI or env.

This feature is disabled by default on HTTP/1 and can be controlled by the boolean `--security-headers` option or the equivalent [SERVER_SECURITY_HEADERS](./../configuration/environment-variables.md#server_security_headers) env.

> [!TIP] Customize HTTP headers
>
> If you want to customize HTTP headers on demand then have a look at the [Custom HTTP Headers](custom-http-headers.md) section.

## Headers included

The following headers are included by default.

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (2 years max-age), only over TLS (`--http2`)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy: frame-ancestors 'self'`

> [!INFO] HSTS over plain HTTP
>
> `Strict-Transport-Security` is never sent over plain HTTP. Behind a TLS-terminating proxy, add it at the proxy or via [Custom HTTP Headers](custom-http-headers.md).
