---
outline: deep
---

# Migrating from v2 to v3

**SWS v3** is a major release that refines the configuration surface, tightens security defaults, and adds new capabilities, while keeping the same fast, single-binary spirit of v2.

Migration is straightforward but requires a few adjustments. This guide covers every breaking change and step you need to take.

Additionally, we encourage you to check out [the server defaults](./defaults.md) and [the features](/v3/) pages for more details.

> [!TIP] Test before deploying
> Always test a major version upgrade in a development environment first.

## Breaking changes

### 1. Default port and root directory changed

SWS now listens on the non-privileged port **`8080`** and serves the **current directory** by default.

|              | v2                     | v3                 |
| ------------ | ---------------------- | ------------------ |
| Default port | `80`                   | `8080`             |
| Default root | `./public`             | `.`                |
| Env          | `SERVER_PORT=80`       | `SERVER_PORT=8080` |
| Env          | `SERVER_ROOT=./public` | `SERVER_ROOT=.`    |

The [HTTPS redirect](./features/http-https-redirect.md) listener (`--https-redirect-from-port`) also moved from `80` to `8080`.

**Action:** If you relied on the defaults, pass them explicitly: `--port 80` (requires `root` or `CAP_NET_BIND_SERVICE`) and `--root ./public`. With `--https-redirect`, set different ports for the server and the redirect listener.

### 2. TLS and HTTP/2 flags are now separate

In v2, `--http2` enabled both TLS **and** HTTP/2 as a bundle. In v3, TLS and HTTP/2 are independent: you enable TLS with `--tls`, then opt into HTTP/2 with `--http2`. The certificate and key flags as well as the environment variables were renamed accordingly.

| v2                               | v3                      |
| -------------------------------- | ----------------------- |
| `-t, --http2`                    | `-t, --tls`             |
| `--http2-tls-cert`               | `--tls-cert`            |
| `--http2-tls-key`                | `--tls-key`             |
| `--http2` (already using HTTP/2) | `--tls` **+** `--http2` |

**Action:** Replace `--http2` with `--tls`, and add `--http2` if you actually need the HTTP/2 protocol. Rename the cert/key flags. Same for env vars and TOML keys.

See [TLS](./features/tls.md) and [HTTP/2](./features/http2.md) pages for more details.

### 3. Symlink flag inverted

The flag was renamed and its meaning flipped, what was a "disable" flag is now an "enable" flag.

| v2                                    | v3                                    |
| ------------------------------------- | ------------------------------------- |
| `--disable-symlinks` (default `true`) | `--follow-symlinks` (default `false`) |
| `SERVER_DISABLE_SYMLINKS=true`        | `SERVER_FOLLOW_SYMLINKS=false`        |

The **default behaviour is unchanged**. Symlinks are still blocked. Only the flag name and polarity changed.

**Action:** Remove `--disable-symlinks` from your configuration (the default is already safe). Read about [the performance and security implications](./features/follow-symlinks.md) before enabling the feature.

### 4. Hidden files flag inverted

Same pattern: renamed and inverted.

| v2                                       | v3                                   |
| ---------------------------------------- | ------------------------------------ |
| `--ignore-hidden-files` (default `true`) | `--include-hidden` (default `false`) |
| `SERVER_IGNORE_HIDDEN_FILES=true`        | `SERVER_INCLUDE_HIDDEN=false`        |

**Action:** Remove `--ignore-hidden-files` from your configuration (the default is already safe). Read about [the security considerations](./features/include-hidden.md) before enabling the feature.

### 5. Pre-compressed static files now enabled by default

| v2                                     | v3                                    |
| -------------------------------------- | ------------------------------------- |
| `--compression-static` default `false` | `--compression-static` default `true` |

SWS v3 automatically serves `.gz`, `.br`, or `.zst` pre-compressed variants when they exist on disk, without needing to opt in.

**Action:** No change needed unless you want to **disable** it: `--compression-static false`.

### 6. Security headers now enabled by default

| v2                                   | v3                                  |
| ------------------------------------ | ----------------------------------- |
| `--security-headers` default `false` | `--security-headers` default `true` |

In v3, `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy` and `Referrer-Policy` are **on by default** in all release binaries. `Strict-Transport-Security` (HSTS) is sent only with `--tls`, and without `preload`. See [Security Headers](./features/security-headers.md).

**Action:** Remove any explicit `--security-headers true` as it's now the default. Set `--security-headers false` if you need them off. Behind a TLS-terminating proxy, add HSTS at the proxy.

### 7. Logging: new format and file output options

v2 only had `--log-with-ansi` (a boolean for ANSI colours on stderr). v3 adds:

| v3 new option     | Description                                                | Default  |
| ----------------- | ---------------------------------------------------------- | -------- |
| `--log-format`    | `json` (structured, one-line) or `pretty` (human-readable) | `json`   |
| `--log-file`      | Path to write logs to (in addition to stderr)              | disabled |
| `--log-with-ansi` | ANSI colours only applies when `--log-format pretty`       | `false`  |

v3 defaults to **structured JSON** output on stderr, no colours, machine-parseable. This is a visible change from v2's plain text output.

At the `info` level, SWS also logs one `response` line per request, with the response status, once the response is sent. See [Per-request logging](./features/logging.md#per-request-logging).

**Action:** If you want the old human-readable stderr output, set `--log-format pretty` (and optionally `--log-with-ansi true`). No env var changes needed for existing deployments unless you were relying on the old default format.

### 8. Text charset: TOML type changed to boolean

| v2 TOML                  | v3 TOML               |
| ------------------------ | --------------------- |
| `text-charset = "utf-8"` | `text-charset = true` |

The `text-charset` key in `[general]` is now a **boolean** rather than a string. The CLI flag was always boolean — only the TOML representation changed.

**Action:** Replace `text-charset = "utf-8"` with `text-charset = true` in your TOML config file.

### 9. WebAssembly is not supported yet

The v2 supports running SWS as a WASM/WASI binary (via Wasmer). However, v3 still does not support it yet.

**Action:** For now, if you run SWS on WASM/WASI, stay on v2 or migrate to a native binary (Linux, macOS, Windows).

### 10. Health endpoint replaced by `/livez` and `/readyz`

|                 | v2         | v3                     |
| --------------- | ---------- | ---------------------- |
| Liveness probe  | `/health`  | `/livez`               |
| Readiness probe | `/health`  | `/readyz`              |
| Enable          | `--health` | `--health` (unchanged) |

v3 no longer serves `/health`. With `--health` enabled, requests to `/health` go to the static file handler like any other path, which usually returns `404 Not Found`. The `--health` flag, the `SERVER_HEALTH` env var and the `health` TOML key are unchanged.

**Action:** Point liveness probes at `/livez` and readiness probes at `/readyz`. Update any load balancer or monitoring check that requests `/health`.

See the [Health endpoint](./features/health-endpoint.md) page for more details.

### 11. Idle connections are now closed

v2 kept idle connections open until the client closed them. v3 closes connections with no reads or writes for `30` seconds. See [Idle Connection Timeout](./features/idle-timeout.md).

**Action:** Usually none. Use `--idle-timeout` to change the timeout, or `0` to disable it.

### 12. Proxy headers are trusted only from listed proxies

|                           | v2             | v3            |
| ------------------------- | -------------- | ------------- |
| Empty `--trusted-proxies` | trusts all IPs | trusts no one |

v2 logged `X-Forwarded-For` from any client when `--trusted-proxies` was empty, so anyone could forge the logged address. v3 logs `X-Real-IP` and `X-Forwarded-For` only for requests from the listed proxy IPs. See [Trusted proxies](./features/logging.md#trusted-proxies).

**Action:** If you use `--log-x-real-ip`, `--log-forwarded-for` or those [access log tokens](./features/logging.md#access-log-format), set `--trusted-proxies` to your proxy IPs.

### 13. Request header size is limited

v3 rejects requests whose headers exceed `16384` bytes (16 KiB) with `431 Request Header Fields Too Large`. See [Maximum Request Header Size](./features/max-header-size.md).

**Action:** Usually none. Raise `--max-header-size` if clients send large headers (e.g. big cookies).

### 14. Shorter `Cache-Control` for HTML

v2 used a one-day `max-age` for HTML and other unlisted file types. v3 uses `no-cache` for them, keeps one year for immutable static assets, and uses `no-cache` for error responses. See [Cache-Control Headers](./features/cache-control-headers.md).

**Action:** Usually none. Use [custom headers](./features/custom-http-headers.md) to set a different policy.

### 15. Fallback page keeps `404` for missing assets

With `--page-fallback`, requests for missing assets (e.g. `/favicon.ico` or a script) now get `404` instead of the fallback page. Page navigations still get the fallback page. See [Fallback Page](./features/error-pages.md#fallback-page-for-use-with-client-routers).

**Action:** None for client-side routers.

### 16. The default host `::` also binds IPv4 on every OS

v3 binds the default `--host ::` as a dual-stack socket, so it accepts IPv4 too on Windows, FreeBSD and Linux with `net.ipv6.bindv6only=1`, where v2 listened on IPv6 only. It then also reserves the port for IPv4.

**Action:** If another service listens on `0.0.0.0` at the same port, SWS now fails with "address in use": change one of the ports, or add `--ipv6-only` to keep `::` IPv6-only as in v2. See [IPv6-Only Host](./features/ipv6-only.md).

## Quick migration checklist

1. **Port & root:** Add `--port 80` and `--root ./public` if you were relying on the defaults.
2. **TLS/HTTP2:** Replace `--http2` with `--tls` and optionally `--http2`. Rename cert/key flags and env vars accordingly.
3. **Symlinks:** Remove `--disable-symlinks` (default safe).
4. **Hidden files:** Remove `--ignore-hidden-files` (default safe).
5. **Pre-compressed:** No action needed (now on by default). Add `--compression-static false` to turn off.
6. **Security headers:** Remove explicit `--security-headers true`. Add `--security-headers false` to opt out.
7. **Logging:** Add `--log-format pretty` if you prefer old-style human-readable logs.
8. **TOML `text-charset`:** Change `"utf-8"` string to `true` boolean.
9. **WebAssembly:** Migrate to a native binary — Wasm is no longer supported.
10. **Health endpoint:** Replace `/health` with `/livez` (liveness) and `/readyz` (readiness) in probes and checks.
11. **Idle timeout:** No action needed (now on by default, `30` seconds). Add `--idle-timeout 0` to turn off.
12. **Trusted proxies:** Set `--trusted-proxies` if you log `X-Real-IP` or `X-Forwarded-For`.
13. **Header size:** Raise `--max-header-size` if clients send headers over 16 KiB.
14. **Cache-Control:** No action needed. HTML now gets `no-cache`.
15. **Fallback page:** No action needed. Missing assets keep their `404`.
16. **Dual-stack:** Make sure no other service uses the same port on `0.0.0.0`, or add `--ipv6-only`.
