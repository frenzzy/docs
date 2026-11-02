# Server defaults

SWS ships with **opinionated, security-first defaults** so you get a safe and performant static file server out of the box, no configuration required. Every default was chosen to minimize the attack surface while keeping the common case fast.

This page lists every default and the reasoning behind it. For changing a default, see the corresponding [CLI argument](./configuration/cli) or [environment variable](./configuration/env).

## Zero configuration

When running `static-web-server` with no flags, you get:

- Serves `./public/` on port `8787`, all interfaces.
- `index.html` as the directory index.
- `404.html` and `50x.html` as error pages (if they exist).
- Gzip/Brotli/Zstd compression for text content.
- Pre-compressed file variants (`.gz`, `.br`, `.zst`) served automatically.
- `Cache-Control` with sensible `max-age` per file type.
- Weak `ETag` validators with full conditional request support.
- `charset=utf-8` for common compressible text responses.
- Trailing-slash redirects for clean directory URLs.
- No symlinks followed, no hidden files exposed.
- JSON structured logging to stderr at `error` level.
- One worker thread per CPU core.

## Network & binding

| Setting                 | Default                             | Rationale                                                                        |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| Host                    | `[::]` (all interfaces, dual-stack) | Reachable from any network interface. IPv4-mapped IPv6 makes it work everywhere. |
| Port                    | `8787`                              | Non-privileged port, no `root` needed.                                           |
| Unix socket             | disabled                            | TCP is the common case; UDS is opt-in for reverse-proxy setups.                  |
| File descriptor passing | disabled                            | Only needed in inetd/systemd/launchd sandboxing scenarios.                       |

## Concurrency

| Setting              | Default       | Rationale                                                                              |
| -------------------- | ------------- | -------------------------------------------------------------------------------------- |
| Worker threads       | 1 x CPU cores | One thread per core avoids oversubscription while saturating I/O.                      |
| Max blocking threads | `512`         | Large enough for filesystem syscalls that can't be async; matches Tokio's own default. |

## Content serving

| Setting                  | Default                   | Rationale                                                                            |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------------------ |
| Root directory           | `./public`                | Predictable relative path and works immediately after `cd` into a project.           |
| Index files              | `index.html`              | Matches every static-site generator and web server convention.                       |
| Custom 404 page          | `./404.html` (if present) | Drop a file and it's picked up; falls back to a generic built-in message.            |
| Custom 50x page          | `./50x.html` (if present) | Same pattern as 404.                                                                 |
| Fallback page            | disabled                  | Only needed for SPAs with client-side routing.                                       |
| Directory listing        | disabled                  | Prevents information disclosure. Enable it explicitly when needed.                   |
| Directory listing order  | unordered (`6`)           | No default sort avoids the cost of reading every directory entry's metadata.         |
| Directory listing format | `html`                    | Human-readable in a browser; switch to `json` for programmatic use.                  |
| Directory download       | disabled                  | Opt-in feature; prevents unintended bulk downloads.                                  |
| Trailing slash redirect  | enabled                   | Normalizes directory URLs (`/blog` to `/blog/`), which keeps relative links working. |

## Security

SWS applies a **layered defence model** on every request: containment -> symlink policy -> hidden file policy.

| Setting              | Default            | Rationale                                                                                                                                                                                                                          |
| -------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Follow symlinks      | disabled           | Symlinks can escape the webroot. SWS rejects them with `403 Forbidden` and walks every path component with `lstat(2)` to detect them.                                                                                              |
| Include hidden files | disabled           | Dotfiles (`.env`, `.git`, etc.) return `404 Not Found`, never accidentally served.                                                                                                                                                 |
| Containment check    | always on          | Verifies every resolved path stays inside the canonical webroot. Uses a per-thread cache (1024 entries, 60s TTL) to keep it fast.                                                                                                  |
| TLS (HTTPS)          | disabled           | Requires explicit setup: certificate + private key paths.                                                                                                                                                                          |
| HTTP/2               | disabled           | Requires TLS first.                                                                                                                                                                                                                |
| HTTPS redirect       | disabled           | Requires TLS. When enabled, redirects HTTP to HTTPS.                                                                                                                                                                               |
| Security headers     | enabled (with TLS) | When TLS is active, every response includes HSTS (2 years), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy: frame-ancestors 'self'`, and `Referrer-Policy: strict-origin-when-cross-origin`. |
| Basic authentication | disabled           | Opt-in; passwords must be BCrypt-hashed.                                                                                                                                                                                           |
| CORS                 | disabled           | No `Access-Control-*` headers unless origins are explicitly configured.                                                                                                                                                            |

## HTTP headers (automatic)

These headers are added to responses with **no configuration** needed:

| Header                   | Default behaviour                                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cache-Control`          | Enabled. Static assets get appropriate max-age: **1 year** for versioned/cacheable types (images, fonts, JS, CSS, etc.), **1 hour** for feeds (Atom/RSS), **`no-cache`** for everything else. |
| `ETag`                   | Enabled. Weak validators (`W/"<mtime>-<size>"`) derived from file metadata, no hashing cost. Full `If-None-Match` / `If-Match` / `If-Range` conditional request support.                      |
| `Content-Type` charset   | Enabled. Appends `; charset=utf-8` to `text/html`, `text/plain`, `text/css`, `text/xml`, `text/markdown`, feeds, and calendar responses that lack a charset parameter.                        |
| `Accept-Encoding` (Vary) | Emitted automatically when compression is active.                                                                                                                                             |

## Compression

| Setting             | Default   | Rationale                                                                                                                                                |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dynamic compression | enabled   | Compresses text-based responses on-the-fly (Gzip, Deflate, Brotli, Zstd) based on the client's `Accept-Encoding` header. Only for responses ≥ 200 bytes. |
| Compression level   | `default` | Algorithm-specific balanced setting a with good speed-to-size ratio.                                                                                     |
| Static compression  | enabled   | If a pre-compressed `.gz`, `.br`, or `.zst` variant exists on disk next to the requested file, it's served directly, zero CPU compression cost.          |

The types considered compressible include all `text/*` MIME types, plus `application/javascript`, `application/json`, `application/xml`, `application/wasm`, `font/*` (except WOFF2 which is already compressed), and icon formats.

## Logging

| Setting                         | Default  | Rationale                                                                                         |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| Log level                       | `error`  | Quiet by default, only problems surface. Bump to `info` or `debug` for diagnostics.               |
| Log format                      | `json`   | Machine-parseable for production log aggregators (Loki, ELK, etc.). Use `pretty` for development. |
| ANSI colors                     | disabled | Off by default since `json` format doesn't use them. Only meaningful with `pretty` format.        |
| Remote address logging          | disabled | Privacy-conscious default. Enable to log client IPs at `info` level.                              |
| `X-Real-IP` / `X-Forwarded-For` | disabled | Only needed behind a reverse proxy. Configure `trusted-proxies` when enabling.                    |
| File logging                    | disabled | Logs go to `stderr`. Opt into file output with an explicit path.                                  |

## Other features

| Setting                      | Default         | Rationale                                                                                                          |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| Health endpoints             | disabled        | Opt-in via `--health`. Returns `200 OK` at `/livez` and `/readyz` with no log noise. For Kubernetes probes.        |
| Metrics endpoint             | disabled        | Opt-in via `--metrics`. Exposes Prometheus metrics at `/metrics`.                                                  |
| Markdown content negotiation | disabled        | Opt-in. When enabled, serves `.md` files for `Accept: text/markdown` requests.                                     |
| Maintenance mode             | disabled        | Opt-in for planned downtime. Returns `503` with a custom page.                                                     |
| Grace period                 | `0s` (no delay) | SIGTERM triggers an immediate graceful shutdown. Set a delay (max 255s) if your load balancer needs time to drain. |
| Idle timeout                 | `30s`           | Connections with no traffic are closed, so abandoned ones don't pile up and use up file descriptors.               |
| Config file                  | `./sws.toml`    | Auto-loaded if present. TOML format for settings that need more structure than CLI flags.                          |
