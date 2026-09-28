---
outline: deep
---

# TOML Configuration File

**`SWS`** can be configured using a [TOML](https://toml.io/en/) file to adjust the general server features as well as other advanced ones.

It's disabled by default and can be enabled by passing a _string file path_ via the `-w, --config-file` option or its equivalent [SERVER_CONFIG_FILE](./../configuration/env#server-config-file) env.

> [!TIP] The default config file path is checked at startup time
> If using the default config file path (`./sws.toml`), SWS will attempt to load it at startup time.
> If it is not found or can not be loaded then SWS will continue using the server defaults.

## TOML File (Manifest)

Below is just an example showing all features with their default values.

```toml
[general]

#### Address & Root dir
host = "::"
port = 8080
root = "."

#### Open the server URL in the browser on startup
open = false
# open-path = "/"

#### Unix domain socket (Unix only)
# unix-socket = "/run/sws.sock"
# unix-socket-mode = 0o660 # octal
unix-socket-force = false

#### File descriptor binding
# fd = 0

#### Logging
log-level = "error"
log-format = "json"
log-with-ansi = false
# log-file = "/var/log/sws.log"

#### Cache Control headers
cache-control-headers = true

#### ETag validators
etag = true

#### Auto Compression
compression = true
compression-level = "default"

#### Check for existing pre-compressed files
compression-static = true

#### Error pages
# Note: If a relative path is used then it will be resolved under the root directory.
page404 = "./404.html"
page50x = "./50x.html"

#### Page fallback for 404s
# page-fallback = ""

#### TLS, HTTP/2 & HTTPS redirect
tls = false
tls-cert = ""
tls-key = ""
http2 = false
https-redirect = false
https-redirect-host = "localhost"
https-redirect-from-port = 8080
https-redirect-from-hosts = "localhost"

#### Security headers
security-headers = true

#### CORS
cors-allow-origins = ""
cors-allow-headers = "origin, content-type, authorization"
cors-expose-headers = "origin, content-type"

#### List of index files
index-files = "index.html"

#### Directory listing
directory-listing = false
directory-listing-order = 6
directory-listing-format = "html"
directory-listing-download = []

#### Basic Authentication
# basic-auth = ""

#### Worker and blocking threads
threads-multiplier = 1
max-blocking-threads = 512

#### Grace period after a graceful shutdown
grace-period = 0

#### Connection idle timeout
idle-timeout = 30

#### Maximum request header size in bytes
max-header-size = 16384

#### Maximum connections served at the same time (0 means no limit)
max-connections = 0

#### Custom access log format (replaces the default request line when set)
# access-log-format = '%{remote_addr} - [%{timestamp}] "%{method} %{uri} %{version}" %{status} %{bytes} "%{referer}" "%{user_agent}"'

#### Log request Remote Address if available
log-remote-address = false

#### Log real IPs from the X-Real-IP and X-Forwarded-For headers of trusted proxies
log-x-real-ip = false
log-forwarded-for = false

#### Proxy IPs to accept the X-Real-IP and X-Forwarded-For headers from. Empty means none
trusted-proxies = []

#### Log the W3C trace context of the `traceparent` header (JSON log format only)
log-trace-context = false

#### Redirect to trailing slash in the requested directory uri
redirect-trailing-slash = true

#### Hidden files and symlinks
include-hidden = false
follow-symlinks = false

#### Use relative root (skip root canonicalization at startup)
use-relative-root = false

#### Health-check endpoints (GET or HEAD `/livez` and `/readyz`)
health = false

#### Prometheus metrics endpoint (`/metrics`)
metrics = false

#### Markdown content negotiation
accept-markdown = false

#### Default charset for text responses
text-charset = true

#### Maintenance Mode
maintenance-mode = false
maintenance-mode-status = 503
# maintenance-mode-file = "./maintenance.html"

### Windows Only

#### Run the web server as a Windows Service
# windows-service = false


[advanced]

#### HTTP Headers customization (examples only)

#### a. Oneline version
# [[advanced.headers]]
# source = "**/*.{js,css}"
# headers = { Access-Control-Allow-Origin = "*" }

#### b. Multiline version
# [[advanced.headers]]
# source = "/index.html"
# [advanced.headers.headers]
# Cache-Control = "public, max-age=36000"
# Content-Security-Policy = "frame-ancestors 'self'"
# Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"

#### c. Multiline version with explicit key (dotted)
# [[advanced.headers]]
# source = "**/*.{jpg,jpeg,png,ico,gif}"
# headers.Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"

#### d. Only for some response statuses, and for every response (not only files)
# [[advanced.headers]]
# source = "**"
# status = [404]
# scope = "all"
# headers.Cache-Control = "no-store"


### URL Redirects (examples only)

# [[advanced.redirects]]
# source = "**/*.{jpg,jpeg}"
# destination = "/images/generic1.png"
# kind = 301

# [[advanced.redirects]]
# source = "/index.html"
# destination = "https://static-web-server.net"
# kind = 302

### URL Rewrites (examples only)

# [[advanced.rewrites]]
# source = "**/*.{png,ico,gif}"
# destination = "/assets/favicon.ico"
## Optional redirection
# redirect = 301

# [[advanced.rewrites]]
# source = "**/*.{jpg,jpeg}"
# destination = "/images/sws.png"

### Virtual Hosting

# [[advanced.virtual-hosts]]
## But if the "Host" header matches this...
# host = "sales.example.com"
## ...then files will be served from here instead
# root = "/var/sales/html"

# [[advanced.virtual-hosts]]
# host = "blog.example.com"
# root = "/var/blog/html"

# [advanced.memory-cache]
# capacity = 100
# ttl = 1800      # 30 minutes
# tti = 300       # 5 minutes
# max-file-size = 8192  # in KiB (8 MiB)
```

### General options

The TOML `[general]` section allows adjusting the current options available via the CLI/ENV ones.

So they are equivalent to each other **except** for the `-w, --config-file` option which is omitted and can not be used for obvious reasons.

> [!INFO] Config file-based features are optional
>
> All server feature options via the configuration file are optional and can be omitted as needed.

### Advanced options

The TOML `[advanced]` section is intended for more complex features.

For example [Custom HTTP Headers](../features/custom-http-headers.md), [Custom URL Redirects](../features/url-redirects.md), [URL Rewrites](../features/url-rewrites.md), [Virtual Hosting](../features/virtual-hosting.md), or [In-Memory Cache](../features/memory-cache.md).

### Precedence

Whatever config file-based feature option will take precedence over its CLI or ENV equivalent.

## Usage

The following command runs the server using a specific `sws.toml` file.

```sh
static-web-server -w sws.toml
```
