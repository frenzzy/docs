<script setup>import Badges from '@theme/components/badges/Badges.vue';</script>

<p align="center">
  <img src="/assets/sws.svg" alt="Static Web Server" width="120" height="120" />
</p>

<br>

<Badges />

<hr>

# Overview

**Static Web Server (SWS)** is a fast and efficient, open-source web server for serving static files and web assets. Built with [Rust](https://www.rust-lang.org/), it combines high performance with memory safety. No garbage collector, no runtime overhead, just a single `~4MB` binary that runs everywhere.

SWS is designed to be **simple by default, powerful when needed**. You can point it at a folder and go with zero configuration, or tune every aspect through CLI flags, environment variables, or a TOML config file.

> [!INFO] Major v3 upgrade
>
> If you use SWS v2 and want to upgrade, check out [the v3 migration guide](./migration-guide.md).

## Features

| Feature                                                                         | Description                                                                                          |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [**HTTP/1**](./features/http1)                                                  | Full HTTP/1.1 protocol support with keep-alive and pipelining.                                       |
| [**HTTP/2**](./features/http2)                                                  | Multiplexed, low-latency HTTP/2 serving for modern clients.                                          |
| [**TLS**](./features/tls)                                                       | HTTPS via TLS 1.2/1.3 with custom certificate and key paths.                                         |
| [**HTTP to HTTPS Redirect**](./features/http-https-redirect)                    | Automatically redirect all HTTP traffic to HTTPS.                                                    |
| [**HTTP Methods**](./features/http-methods)                                     | Verify HTTP verbs supported (GET, POST, HEAD, etc.).                                                 |
| [**Compression**](./features/compression)                                       | On-the-fly `gzip`, `brotli`, and `zstd` compression to shrink payloads.                              |
| [**Pre-compressed Files**](./features/compression-static)                       | Serve `.gz`, `.br`, `.zst` files straight from disk.                                                 |
| [**Cache-Control Headers**](./features/cache-control-headers)                   | Customize browser caching policies per content type.                                                 |
| [**ETag**](./features/etag)                                                     | Conditional requests with ETag headers for efficient revalidation.                                   |
| [**CORS**](./features/cors)                                                     | Cross-Origin Resource Sharing with configurable origins, methods, and headers.                       |
| [**Security Headers**](./features/security-headers)                             | Hardened defaults for X-Content-Type-Options, CSP, HSTS, and more.                                   |
| [**Basic Authentication**](./features/basic-authentication)                     | Password-protect any directory with a single config line.                                            |
| [**Directory Listing**](./features/directory-listing)                           | Optional file listing with sorting, filtering, and JSON output.                                      |
| [**Custom HTTP Headers**](./features/custom-http-headers)                       | Inject arbitrary headers into every response.                                                        |
| [**URL Rewrites**](./features/url-rewrites)                                     | Rewrite request paths with glob patterns, useful for clean URLs or SPA routing.                      |
| [**URL Redirects**](./features/url-redirects)                                   | Redirect matching paths to new destinations with configurable status codes.                          |
| [**Trailing Slash Redirect**](./features/trailing-slash-redirect)               | Enforce or remove trailing slashes on directory URLs.                                                |
| [**Error Pages**](./features/error-pages)                                       | Replace the default 404/5xx pages with your own HTML files.                                          |
| [**Logging**](./features/logging)                                               | Structured JSON or human-readable text combined logs to stdout or a file.                            |
| [**Health Endpoint**](./features/health-endpoint)                               | The `/livez` and `/readyz` routes for load balancer and orchestrator checks.                         |
| [**Metrics**](./features/metrics)                                               | Prometheus-compatible metrics endpoint for monitoring and alerting.                                  |
| [**Virtual Hosting**](./features/virtual-hosting)                               | Serve multiple domains from a single SWS instance by host header routing.                            |
| [**Multiple Index Files**](./features/multiple-index-files)                     | Fallback chain of index documents (`index.html`, `index.htm`, etc.).                                 |
| [**Follow Symlinks**](./features/follow-symlinks)                               | Resolve symbolic links when serving files from the root directory.                                   |
| [**Include Hidden Files**](./features/include-hidden)                           | Control whether dotfiles like `.htaccess` or `.env` are accessible.                                  |
| [**Maintenance Mode**](./features/maintenance-mode)                             | Display a custom maintenance page while you deploy updates.                                          |
| [**Graceful Shutdown**](./features/graceful-shutdown)                           | Drain in-flight connections before stopping, zero dropped requests.                                  |
| [**Idle Connection Timeout**](./features/idle-timeout)                          | Close idle or stalled connections after a configurable timeout.                                      |
| [**Windows Service**](./features/windows-service)                               | Install SWS as a native Windows Service with `sc` or the installer.                                  |
| [**Docker**](./features/docker)                                                 | Official images on `scratch`, `Alpine`, and `Debian` for several architectures.                      |
| [**Unix Domain Socket**](./features/unix-domain-socket)                         | Listen on a UDS path for secure, low-latency local proxying.                                         |
| [**File Descriptor Socket Passing**](./features/file-descriptor-socket-passing) | Pass a pre-opened socket via FD for seamless hot-reload setups.                                      |
| [**Worker Threads**](./features/worker-threads)                                 | Tune the thread pool to balance latency and throughput.                                              |
| [**Blocking Threads**](./features/blocking-threads)                             | Reserve threads for blocking I/O to keep the event loop responsive.                                  |
| [**In-Memory Cache**](./features/memory-cache)                                  | Cache frequently accessed files in RAM with configurable TTL and capacity for even faster responses. |
| [**Markdown Content Negotiation**](./features/markdown-content-negotiation)     | Serve Markdown as rendered HTML or raw text based on the client's `Accept` header.                   |
| [**Default Charset for Text Responses**](./features/text-charset)               | Set a fallback charset (e.g. `utf-8`) for text-based content types.                                  |
| [**Man Pages & Shell Completions**](./features/man-pages-completions)           | Built-in `--help`, man page, and shell completions for Bash, Zsh, Fish, and PowerShell.              |

---

Ready to get started? Head over to the [Quick Start](./quick-start) guide or jump straight to [Download & Install](./download-install).
