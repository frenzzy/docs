---
outline: deep
---

# Logging

**`SWS`** emits structured logs. Each log entry carries a consistent set of base fields (`timestamp`, `level`, `message`, `target`) plus event-specific fields, so logs can be parsed by aggregation systems or read directly.

## Log Level

Set the level with the `-g, --log-level` option or the equivalent [SERVER_LOG_LEVEL](./../configuration/env#server_log_level) env.

Values are `error`, `warn`, `info`, `debug` and `trace`. The default is `error`, which is suited for production.

```sh
static-web-server \
    --port 8787 \
    --root ./my-public-dir \
    --log-level "info"
```

The default `error` level keeps production output limited to failures. Use `info` to see startup configuration and per-request logs, and `debug` or `trace` for diagnostics.

## Log Format

SWS writes logs as single-line JSON by default. Set the format with the `--log-format` option or the equivalent [SERVER_LOG_FORMAT](./../configuration/env#server_log_format) env.

### JSON format

The `json` format writes one JSON object per line to standard error. Every entry contains `timestamp`, `level`, `message` and `target`. Additional fields depend on the event.

```sh
static-web-server -p 8787 -d ./public/ -g info --log-format json
```

```json
{"timestamp":"2026-05-29T23:42:41.505241+02:00","level":"INFO","message":"starting Static Web Server","name":"static-web-server","version":"2.42.0","target":"static_web_server::server"}
{"timestamp":"2026-05-29T23:42:41.506488+02:00","level":"INFO","message":"log level","log_level":"info","target":"static_web_server::server"}
{"timestamp":"2026-05-29T23:42:41.506629+02:00","level":"INFO","message":"server bound to tcp socket","addr":"[::]:8787","target":"static_web_server::server"}
{"timestamp":"2026-05-29T23:42:41.506659+02:00","level":"INFO","message":"runtime worker threads","worker_threads":4,"target":"static_web_server::server"}
```

Feature configuration logs share a common `enabled` boolean field:

```json
{"timestamp":"2026-05-29T23:42:41.507288+02:00","level":"INFO","message":"compression static","enabled":true,"target":"static_web_server::compression_static"}
{"timestamp":"2026-05-29T23:42:41.507364+02:00","level":"INFO","message":"etag headers","enabled":true,"target":"static_web_server::etag"}
```

### Pretty format

The `pretty` format writes human-readable text, suited for local development. Fields appear after the message as `key=value` pairs.

```sh
static-web-server -p 8787 -d ./public/ -g info --log-format pretty
```

```log
2026-05-29T23:44:04.703047+02:00  INFO static_web_server::server: starting Static Web Server name="static-web-server" version="2.42.0"
2026-05-29T23:44:04.704137+02:00  INFO static_web_server::compression: auto compression enabled=true formats=deflate,gzip,brotli,zstd compression_level=Default
2026-05-29T23:44:05.724579+02:00  INFO static_web_server::log_addr: incoming request method=GET uri=/
```

## Log Date-Timestamp

SWS uses the local system time for the `timestamp` field by default to respect the host's timezone. The POSIX [TZ](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap08.html) environment variable overrides the timezone. Timestamps are RFC 3339 and include the UTC offset.

Use the default system timezone (e.g. CET "UTC +1"):

```sh
$ static-web-server -p 8788 -d /var/public/ -g info
# {"timestamp":"2026-02-26T22:26:56.369326294+01:00","level":"INFO","message":"starting Static Web Server","name":"static-web-server","version":"2.41.0","target":"static_web_server::server"}
```

Use a particular timezone via the `TZ` env (e.g. PET "UTC -5"):

```sh
$ TZ="America/Lima" \
    static-web-server -p 8788 -d /var/public/ -g info
# {"timestamp":"2026-02-26T16:25:55.345113713-05:00","level":"INFO","message":"starting Static Web Server","name":"static-web-server","version":"2.41.0","target":"static_web_server::server"}
```

## Log output with ANSI

The `pretty` format does not output ANSI escape codes by default. Enable colors and other text formatting with the boolean `--log-with-ansi` option or the equivalent [SERVER_LOG_WITH_ANSI](./../configuration/env#server_log_with_ansi) env. This option has no effect on the `json` format.

```sh
static-web-server -p 8788 -d ./public/ -g trace --log-format pretty --log-with-ansi
```

## Per-request logging

When the level is `info` or lower, SWS logs each request with the `incoming request` message. Requests to the health endpoint are logged at `debug` level instead, to avoid noise from frequent probes.

```json
{
  "timestamp": "2026-05-29T23:43:47.151533+02:00",
  "level": "INFO",
  "message": "incoming request",
  "method": "GET",
  "uri": "/",
  "target": "static_web_server::log_addr"
}
```

The `remote_addr`, `x_real_ip` and `real_remote_ip` fields are added when the corresponding logging options are enabled and a value is available, and the `trace_id`, `span_id` and `trace_flags` fields when [trace context logging](#logging-trace-context) is enabled. Fields without a value are omitted.

## Log Remote Addresses

SWS adds the client's _Remote Address (IP)_ to each request log.

This feature is disabled by default. Enable it with the boolean `--log-remote-address` option or the equivalent [SERVER_LOG_REMOTE_ADDRESS](./../configuration/env#server_log_remote_address) env. When enabled, request logs include a `remote_addr` field.

```sh
static-web-server -a "0.0.0.0" -p 8080 -d docker/public/ -g info --log-remote-address=true
```

```json
{"timestamp":"2026-05-29T23:43:47.071681+02:00","level":"INFO","message":"log requests with remote IP addresses","enabled":true,"target":"static_web_server::log_addr"}
{"timestamp":"2026-05-29T23:43:47.151533+02:00","level":"INFO","message":"incoming request","method":"GET","uri":"/","remote_addr":"192.168.1.126","target":"static_web_server::log_addr"}
```

## Logging Client IP from X-Real-IP header

Some upstream proxies report the client's real IP address in the `X-Real-IP` header.

Enable logging of the `X-Real-IP` header with the `--log-x-real-ip` option or the equivalent [SERVER_LOG_X_REAL_IP](../configuration/env#server_log_x_real_ip) env. When enabled, request logs include an `x_real_ip` field.

```json
{
  "timestamp": "2026-05-29T23:43:47.151533+02:00",
  "level": "INFO",
  "message": "incoming request",
  "method": "GET",
  "uri": "/",
  "x_real_ip": "203.0.113.195",
  "target": "static_web_server::log_addr"
}
```

If the value of the `X-Real-IP` header does not parse as an IP address, the `x_real_ip` field is omitted.

To restrict logging to requests that originate from trusted proxy IPs, use the `--trusted-proxies` option or the equivalent [SERVER_TRUSTED_PROXIES](../configuration/env#server_trusted_proxies) env. This is a comma-separated list of IPs. An empty list (the default) trusts all IPs.

## Logging Client IP from X-Forwarded-For header

> Note: Trust this header only when the upstream handles `X-Forwarded-For` securely and the `--trusted-proxies` option is set.

When SWS runs behind a reverse proxy, the `remote_addr` field reports the proxy's IP address, not the client's. The proxy can be configured to send the [X-Forwarded-For header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For), a comma-separated list of IP addresses that starts with the _real remote client IP_ followed by intermediate proxies.

Enable logging of the real remote IP with the `--log-forwarded-for` option or the equivalent [SERVER_LOG_FORWARDED_FOR](../configuration/env#server_log_forwarded_for) env. By default this logs every request with a correctly formatted `X-Forwarded-For` header, adding a `real_remote_ip` field.

Because any proxy in the chain can change the `X-Forwarded-For` header, the reported IP may not be trustworthy. Restrict logging to trusted proxy IPs with the `--trusted-proxies` option or the equivalent [SERVER_TRUSTED_PROXIES](../configuration/env#server_trusted_proxies) env. This is a comma-separated list of IPs. An empty list (the default) trusts all IPs.

Command used for the following examples:

```sh
static-web-server -a "::" --log-forwarded-for=true --trusted-proxies="::1" -p 8080 -d docker/public/ -g info
```

Look for these lines in the log output:

```json
{"timestamp":"2026-05-29T23:43:47.071681+02:00","level":"INFO","message":"log level","log_level":"info","target":"static_web_server::server"}
{"timestamp":"2026-05-29T23:43:47.071700+02:00","level":"INFO","message":"log X-Forwarded-For header","enabled":true,"target":"static_web_server::log_addr"}
{"timestamp":"2026-05-29T23:43:47.071710+02:00","level":"INFO","message":"trusted IPs for X-Forwarded-For","trusted_proxies":"[::1]","target":"static_web_server::log_addr"}
```

Simulate a request from behind a reverse proxy with an additional intermediate proxy:

```sh
curl "http://[::1]:8080" --header "X-Forwarded-For: 203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348"
```

The request log includes the `real_remote_ip` field:

```json
{
  "timestamp": "2026-05-29T23:43:47.151533+02:00",
  "level": "INFO",
  "message": "incoming request",
  "method": "GET",
  "uri": "/",
  "real_remote_ip": "203.0.113.195",
  "target": "static_web_server::log_addr"
}
```

---

If the request comes from `127.0.0.1` instead:

```sh
curl "http://127.0.0.1:8080" --header "X-Forwarded-For: 203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348"
```

the log omits `real_remote_ip`:

```json
{
  "timestamp": "2026-05-29T23:43:47.151533+02:00",
  "level": "INFO",
  "message": "incoming request",
  "method": "GET",
  "uri": "/",
  "target": "static_web_server::log_addr"
}
```

`127.0.0.1` is not in `trusted_proxies`, so no `real_remote_ip` field is added. To log both the proxy address and the real remote address, set both `--log-remote-address` and `--log-forwarded-for`.

---

SWS parses the `X-Forwarded-For` header and ignores an invalid client IP to prevent log poisoning attacks. In that case the `real_remote_ip` field is omitted.

Example from above, but with an invalid header:

```sh
curl "http://[::1]:8080" --header "X-Forwarded-For: <iframe src=//malware.attack>"
```

```json
{
  "timestamp": "2026-05-29T23:43:47.151533+02:00",
  "level": "INFO",
  "message": "incoming request",
  "method": "GET",
  "uri": "/",
  "target": "static_web_server::log_addr"
}
```

## Logging Trace Context

When SWS runs behind a proxy or load balancer that starts or continues a [W3C Trace Context](https://www.w3.org/TR/trace-context/) trace, the proxy forwards a `traceparent` request header. SWS can add the trace context of that header to its log lines, so a log backend can link them to the trace and to the logs of other services.

This feature is disabled by default. Enable it with the boolean `--log-trace-context` option, the equivalent [SERVER_LOG_TRACE_CONTEXT](./../configuration/env#server_log_trace_context) env or the `log-trace-context` key of the config file. It requires the `json` [log format](#log-format).

When enabled and the request has a valid `traceparent` header, the log lines emitted by the request handler get three top-level fields, as recommended by the OpenTelemetry [Trace Context in Non-OTLP Log Formats](https://opentelemetry.io/docs/specs/otel/compatibility/logging_trace_context/) specification:

- `trace_id`: the `trace-id` of the header (32 lowercase hex characters).
- `span_id`: the `parent-id` of the header (16 lowercase hex characters), which is the span of the caller. SWS does not create spans of its own.
- `trace_flags`: the `trace-flags` of the header (2 lowercase hex characters).

```sh
static-web-server -p 8787 -d ./public/ -g info --log-trace-context
```

```sh
curl "http://localhost:8787/missing.css" \
    --header "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
```

```json
{"timestamp":"2026-09-28T10:39:57.103529+02:00","level":"INFO","message":"incoming request","method":"GET","uri":"/missing.css","target":"static_web_server::log_addr","span_id":"00f067aa0ba902b7","trace_flags":"01","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}
{"timestamp":"2026-09-28T10:39:57.103712+02:00","level":"WARN","method":"GET","uri":"/missing.css","status":404,"error":"Not Found","target":"static_web_server::error_page","span_id":"00f067aa0ba902b7","trace_flags":"01","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}
```

The fields are added at every log level, e.g. to the `404` warning when the level is `warn`.

SWS only reads the header. It does not generate trace IDs, export spans or change the headers of the request or the response. Missing, invalid or repeated `traceparent` headers are ignored; see the specification's [versioning rules](https://www.w3.org/TR/trace-context/#versioning-of-traceparent).

## File Logging

By default **SWS** writes log records to standard error. The `--log-file` option additionally streams every record to a file on disk, in **addition** to `stderr`. This is useful for production deployments where `stderr` is captured by a service manager but a durable on-disk copy is also required.

### Options

| CLI option          | Environment variable                                      | TOML key   | Description                                                                                                                                             |
| ------------------- | --------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--log-file <PATH>` | [`SERVER_LOG_FILE`](../configuration/env#server_log_file) | `log-file` | Filesystem path to stream log records to in addition to `stderr`. Missing parent directories are created on startup. The file is opened in append mode. |

The file uses the format selected by [`--log-format`](./logging.md#log-format) (`json` by default) and the level selected by [`--log-level`](./logging.md#log-level). ANSI escape codes are **always disabled** for file output regardless of `--log-with-ansi`, so the file stays parsable.

### Example

```sh
static-web-server \
    --port 8787 \
    --root ./my-public-dir \
    --log-level info \
    --log-format json \
    --log-file /var/log/sws/server.log
```

Every log record is now written twice: once to stderr (so `systemd`/`journalctl`, Docker logging drivers, etc. continue to work) and once to `/var/log/sws/server.log`.

### Concurrency and performance

- File writes are performed by a dedicated background worker thread using a lock-free queue. The request path never blocks on disk I/O, regardless of how slow or congested the underlying filesystem is.
- The default queue capacity (`128,000` lines) is large enough that messages are dropped only under extreme back-pressure, as a right trade-off for a server hot path where blocking the request path on disk would be far worse than losing a debug line.
- File writes are **append-only**: SWS never rewrites or truncates the log file, so log shippers (Fluent Bit, Vector, Filebeat, etc.) can tail it safely.

### Log rotation

SWS does **not** rotate the file itself. Use an external tool such as [`logrotate`](https://linux.die.net/man/8/logrotate) with the `copytruncate` strategy, or have your log shipper rotate via `dateext` on a schedule. A minimal `logrotate.d` snippet:

```text
/var/log/sws/server.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    copytruncate
}
```

`copytruncate` is recommended because SWS keeps the file descriptor open for the lifetime of the process, a plain `move + create` rotation would leave SWS writing to the rotated (now-renamed) file until restart.

### TOML configuration

```toml
[general]
log-level = "info"
log-format = "json"
log-file = "/var/log/sws/server.log"
```

### Permissions

The log file and any missing parent directories are created with the process umask. To restrict access, set a tighter umask before launching SWS, or create the directory with the desired ownership and mode ahead of time:

```sh
install -d -m 0750 -o sws -g sws /var/log/sws
```
