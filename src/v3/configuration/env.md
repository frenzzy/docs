# Environment Variables

The server can be configured via the following environment variables.

> [!TIP] Remember
>
> - Environment variables are equivalent to their [command-line arguments](./cli).
> - Command-line arguments take precedence over their equivalent environment variables.

## SERVER_HOST

Host address (e.g. `127.0.0.1` or `::1`). Default `[::]`.

## SERVER_PORT

Host port. Default `8787`.

## SERVER_LISTEN_FD

Instead of binding to a TCP port, accept incoming connections to an already-bound TCP socket listener on the specified file descriptor number (usually zero). Requires that the parent process (e.g. inetd, launchd, or systemd) binds an address and port on behalf of static-web-server, before arranging for the resulting file descriptor to be inherited by static-web-server. Cannot be used in conjunction with the port and host arguments. The included systemd unit file utilises this feature to increase security by allowing the static-web-server to be sandboxed more completely. Default empty (disabled).

## SERVER_UNIX_SOCKET

Bind the server to a Unix Domain Socket (UDS) at the given filesystem path instead of a TCP host/port. Useful for reverse-proxy setups (e.g. nginx) on the same host where TCP/IP overhead is undesirable and filesystem-based access control is preferred. Cannot be combined with `SERVER_HOST`, `SERVER_PORT`, `SERVER_LISTEN_FD`, or TLS-related options. The socket file is removed on a graceful shutdown. Default empty (disabled).

## SERVER_UNIX_SOCKET_MODE

Filesystem permission bits applied to the Unix socket file after binding, expressed in octal (e.g. `660`, `0660`, or `0o660`). When omitted the socket is created with the process umask. Only meaningful together with `SERVER_UNIX_SOCKET`. Default: process umask.

## SERVER_UNIX_SOCKET_FORCE

When `true`, remove an existing socket file at `SERVER_UNIX_SOCKET` before binding. This is useful when the server was previously killed abruptly and left a stale socket behind. Defaults to `false` to avoid clobbering an unrelated file.

## SERVER_THREADS_MULTIPLIER

Number of worker threads multiplier that'll be multiplied by the number of system CPUs using the formula: `worker threads = number of CPUs * n` where `n` is the value that changes here. When multiplier value is 0 or 1 then one thread per core is used. Number of worker threads result should be a number between 1 and 32,768 though it is advised to keep this value on the smaller side. Default `1`.

## SERVER_MAX_BLOCKING_THREADS

Maximum number of blocking threads. Default `512`.

## SERVER_ROOT

Root directory path of static files. Default `./public`.

## SERVER_ERROR_PAGE_50X

HTML file path for 50x errors. If the path is not specified or simply doesn't exist then the server will use a generic HTML error message. If a relative path is used then it will be resolved under the root directory. Default `./50x.html`.

## SERVER_ERROR_PAGE_404

HTML file path for 404 errors. If the path is not specified or simply doesn't exist then the server will use a generic HTML error message. If a relative path is used then it will be resolved under the root directory. Default `./404.html`.

## SERVER_FALLBACK_PAGE

A HTML file path (not relative to the root) used for `GET` requests when the requested path doesn't exist. The fallback page is served with a `200` status code, useful when using client routers. If the path doesn't exist then the feature is not activated.

## SERVER_LOG_LEVEL

Specify a logging level in lower case. Possible values are `error`, `warn`, `info`, `debug` or `trace`. Default `error`.

## SERVER_LOG_FORMAT

Specify the logging output format. Possible values are `json` (structured single-line JSON for production) or `pretty` (human-readable text for development). Default `json`.

## SERVER_LOG_WITH_ANSI

Enable or disable ANSI escape codes for colors and other text formatting of the log output. Only effective when `SERVER_LOG_FORMAT` is set to `pretty`. Default `false`.

## SERVER_LOG_FILE

Optional filesystem path to stream log records to in addition to `stderr`. When set, logs are written asynchronously through a background worker thread (non-blocking I/O), so the request path is never delayed by disk writes. Missing parent directories are created on startup. ANSI escape codes are always disabled for file output regardless of `SERVER_LOG_WITH_ANSI`. The file uses the format selected by `SERVER_LOG_FORMAT` (JSON by default). The file is opened in append mode and is not rotated by SWS, use an external tool (e.g. `logrotate`) for rotation. Default empty (disabled).

## SERVER_CORS_ALLOW_ORIGINS

Specify an optional CORS list of allowed origin hosts separated by commas. Host ports or protocols aren't being checked. Use an asterisk (\*) to allow any host. Default empty (disabled).

## SERVER_CORS_ALLOW_HEADERS

Specify an optional CORS list of allowed HTTP headers separated by commas. It requires `SERVER_CORS_ALLOW_ORIGINS` to be used along with. Default `origin, content-type, authorization`.

## SERVER_CORS_EXPOSE_HEADERS

Specify an optional CORS list of exposed HTTP headers separated by commas. It requires `SERVER_CORS_ALLOW_ORIGINS` to be used along with. Default `origin, content-type`.

## SERVER_TLS

Enable TLS/HTTPS support. Requires `SERVER_TLS_CERT` and `SERVER_TLS_KEY`. Default `false` (disabled).

## SERVER_TLS_CERT

Specify the file path to the TLS certificate. Default empty (disabled).

## SERVER_TLS_KEY

Specify the file path to the TLS private key. Default empty (disabled).

## SERVER_HTTP2

Enable HTTP/2 protocol support. Requires TLS to be enabled (`SERVER_TLS`). Default `false` (disabled).

## SERVER_HTTPS_REDIRECT

Redirect all requests with scheme "http" to "https" for the current server instance. Requires TLS to be enabled (`SERVER_TLS`). Default `false` (disabled).

## SERVER_HTTPS_REDIRECT_HOST

Canonical host name or IP of the HTTPS server. It depends on `SERVER_HTTPS_REDIRECT` to be enabled. Default `localhost`.

## SERVER_HTTPS_REDIRECT_FROM_PORT

HTTP host port where the redirect server will listen for requests to redirect them to HTTPS. It depends on `SERVER_HTTPS_REDIRECT` to be enabled. Default `80`.

## SERVER_HTTPS_REDIRECT_FROM_HOSTS

List of host names or IPs allowed to redirect from. HTTP requests must contain the HTTP 'Host' header and match against this list. It depends on `SERVER_HTTPS_REDIRECT` to be enabled. Default `localhost`.

## SERVER_INDEX_FILES

List of files that will be used as an index for requests ending with the slash character ('/'). Files are checked in the specified order. Default `index.html`.

## SERVER_COMPRESSION

`Gzip`, `Deflate`, `Brotli` or `Zstd` compression on demand determined by the `Accept-Encoding` header and applied to text-based web file types only. See [ad-hoc mime-type list](https://github.com/static-web-server/static-web-server/blob/master/src/compression.rs#L20). Default `true` (enabled).

## SERVER_COMPRESSION_LEVEL

Compression level to apply for `Gzip`, `Deflate`, `Brotli` or `Zstd` compression. Supported values are `fastest` (fast compression but larger resulting files), `best` (smallest file size but potentially slow) and `default` (algorithm-specific balanced compression level). Default `default`.

## SERVER_COMPRESSION_STATIC

Look up the pre-compressed file variant (`.gz`, `.br` or `.zst`) on disk of a requested file and serve it directly if available. The compression type is determined by the `Accept-Encoding` header. Default `true` (enabled).

## SERVER_DIRECTORY_LISTING

Enable directory listing for all requests ending with the slash character ('/'). Default `false` (disabled).

## SERVER_DIRECTORY_LISTING_ORDER

Specify a default code number to order directory listing entries per `Name`, `Last modified` or `Size` attributes (columns). Code numbers supported: `0` (Name asc), `1` (Name desc), `2` (Last modified asc), `3` (Last modified desc), `4` (Size asc), `5` (Size desc). Default `6` (unordered).

## SERVER_DIRECTORY_LISTING_FORMAT

Specify a content format for directory listing entries. Formats supported: `html` or `json`. Default `html`.

## SERVER_DIRECTORY_LISTING_DOWNLOAD

Specify list of enabled format(s) for directory download. Format supported: `targz`. Default to empty list (disabled).

## SERVER_SECURITY_HEADERS

Enable security headers by default when TLS feature is activated. Headers included: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (2 years max-age), `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'self'`. Default `true` (enabled).

## SERVER_CACHE_CONTROL_HEADERS

Enable cache control headers for incoming requests based on a set of file types. The file type list can be found in [`src/control_headers.rs`](https://github.com/static-web-server/static-web-server/blob/master/src/control_headers.rs) file. Default `true` (enabled).

## SERVER_ETAG

Enable weak `ETag` headers (`W/"<mtime>-<size>"`) and full conditional request handling (`If-None-Match`, `If-Match`, `If-Range`). Composes with `SERVER_CACHE_CONTROL_HEADERS`; emits validators on every static-file response so clients can revalidate hot HTML even when long `max-age` is configured elsewhere. Default `true` (enabled).

## SERVER_BASIC_AUTH

It provides [The "Basic" HTTP Authentication Scheme](https://datatracker.ietf.org/doc/html/rfc7617) using credentials as `user-id:password` pairs, encoded using `Base64`. Password must be encoded using the [BCrypt](https://en.wikipedia.org/wiki/Bcrypt) password-hashing function. Default empty (disabled).

## SERVER_GRACE_PERIOD

Defines a grace period in seconds after a `SIGTERM` signal is caught which will delay the server before shutting it down gracefully. The maximum value is `255` seconds. Default `0`.

## SERVER_CONFIG_FILE

Server TOML configuration file path. See [The TOML Configuration File](../configuration/file). Default `./sws.toml`.

## SERVER_LOG_REMOTE_ADDRESS

Log incoming requests information along with its remote address if available using the `info` log level. Default `false`.

## SERVER_LOG_X_REAL_IP

Log the `X-Real-IP` header for remote IP information. Default `false`.

## SERVER_LOG_FORWARDED_FOR

Log the `X-Forwarded-For` header for remote IP information. Default `false`.

## SERVER_TRUSTED_PROXIES

List of IPs to use `X-Forwarded-For` from. The default is to trust all. Default `""`.

## SERVER_LOG_TRACE_CONTEXT

Add the trace context of a valid W3C `traceparent` request header to the JSON log lines of the request handler. See [Logging Trace Context](../features/logging#logging-trace-context). Default `false`.

## SERVER_REDIRECT_TRAILING_SLASH

Check for a trailing slash in the requested directory URI and redirect permanently (308) to the same path with a trailing slash suffix if it is missing. Default `true` (enabled).

## SERVER_INCLUDE_HIDDEN

Include hidden files/directories (dotfiles), allowing them to be served and listed in auto HTML index pages (directory listing). Disabled by default; hidden files return `404 Not Found`.

## SERVER_FOLLOW_SYMLINKS

Follow symbolic links when serving files or directories. Disabled by default; requests whose path contains any symlink component return `403 Forbidden`.

## SERVER_USE_RELATIVE_ROOT

When enabled, the root directory canonicalization at startup is skipped. This allows symlinked root directories to be resolved at request time rather than at startup, making it possible to swap symlink targets at runtime without restarting the server. See [Use Relative Root](../features/use-relative-root) for details and security considerations. Default `false`.

## SERVER_ACCEPT_MARKDOWN

Enable markdown content negotiation. When a client sends `Accept: text/markdown`, serve `.md` or `.html.md` files if available. See [Markdown Content Negotiation](../features/markdown-content-negotiation.md) for details. Default `false`.

## SERVER_TEXT_CHARSET

Set a default `charset=utf-8` parameter on limited set of `text` responses that don't already have one. See [Default Charset for Text Responses](../features/text-charset.md) for details. Default `true`; set to `false` to disable.

## SERVER_HEALTH

Add a `/health` endpoint that doesn't generate any log entry and returns a `200` status code. This is especially useful with Kubernetes liveness and readiness probes. Default `false` (disabled).

## SERVER_METRICS

Enable the `/metrics` endpoint that exposes Prometheus metrics for HTTP requests, connections, and latency. See [Metrics](../features/metrics.md) for details. Default `false` (disabled).

## SERVER_MAINTENANCE_MODE

Enable the server's maintenance mode functionality. Default `false` (disabled).

## SERVER_MAINTENANCE_MODE_STATUS

Provide a custom HTTP status code when entering into maintenance mode. Default `503`.

## SERVER_MAINTENANCE_MODE_FILE

Provide a custom maintenance mode HTML file. If not provided then a generic message will be displayed.

## Windows

The following options and commands are Windows platform-specific.

## SERVER_WINDOWS_SERVICE

Run the web server as a Windows Service. See [more details](../features/windows-service.md). Default `false`.
