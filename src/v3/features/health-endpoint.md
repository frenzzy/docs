# Health endpoint

SWS provides optional health endpoints for the Kubernetes-style [liveness and readiness probes](https://kubernetes.io/docs/reference/using-api/health-checks/):

| Path      | Probe     |
| --------- | --------- |
| `/livez`  | Liveness  |
| `/readyz` | Readiness |

This feature is disabled by default and can be controlled by the boolean `--health` option, the equivalent [SERVER_HEALTH](../configuration/env.md#server_health) env, or the `health` key in the [config file](../configuration/file.md).

```sh
static-web-server --root ./public --health
SERVER_HEALTH=true static-web-server --root ./public
```

```toml
[general]
health = true
```

> [!WARNING] `/health` was removed in v3
> SWS v2 served a single `/health` endpoint. SWS v3 serves `/livez` and `/readyz` instead, and requests to `/health` go to the static file handler like any other path. See the [migration guide](../migration-guide.md#_10-health-endpoint-replaced-by-livez-and-readyz).

## Behavior

When the feature is enabled, SWS answers `GET` and `HEAD` requests to `/livez` and `/readyz` with `200 OK`:

- `GET` returns the body `OK` with `Content-Type: text/plain; charset=utf-8`.
- `HEAD` returns the same headers with an empty body.
- The query string is ignored, so `/livez?verbose` and `/readyz?verbose` also return `200 OK`.
- Only the exact paths match: `/livez/`, `/readyz/` or `/LIVEZ` go to the static file handler.
- Other methods are not handled by the health endpoints: `OPTIONS` goes on to the rest of the request pipeline (e.g. [CORS](./cors.md)), and methods SWS does not support, such as `POST`, return `405 Method Not Allowed`.
- Requests are logged at `debug` level instead of the usual `info` level, to avoid noise from frequent probes. See [Logging](./logging.md#per-request-logging).

Once shutdown starts (`SIGTERM`, `SIGINT`, `SIGQUIT` or <kbd>CTRL + C</kbd> on Windows), `/readyz` returns `503 Service Unavailable` with the body `shutting down`, while `/livez` keeps returning `200 OK`. With a [grace period](./graceful-shutdown.md), SWS keeps serving requests during that time, so load balancers stop routing new traffic before connections close.

```sh
curl -i http://localhost:8787/livez
```

```text
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
content-length: 2

OK
```

When the feature is disabled, `/livez` and `/readyz` are regular paths served from the root directory.

## Interaction with other features

The health endpoints run before [CORS](./cors.md), [Basic Authentication](./basic-authentication.md), [maintenance mode](./maintenance-mode.md), [URL redirects](./url-redirects.md) and [URL rewrites](./url-rewrites.md), so probes succeed without credentials and while maintenance mode is on.

[Custom HTTP headers](./custom-http-headers.md) apply to the health endpoints only with `scope = "all"`.

## Usage with Kubernetes probes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
    - name: sws
      image: frontend:1.0.0
      command:
        - static-web-server
        - --root=/public
        - --log-level=info
        - --health
      ports:
        - containerPort: 8787
          name: http
      livenessProbe:
        httpGet:
          path: /livez
          port: http
      readinessProbe:
        httpGet:
          path: /readyz
          port: http
```

Add `--grace-period` (e.g. `--grace-period=10`) so `/readyz` fails while SWS still serves in-flight and new requests during a rollout. Keep it below the pod's `terminationGracePeriodSeconds` (default `30`).

### With TLS

With [`--tls`](./tls.md), point the probes at the TLS port and set `scheme: HTTPS`. The kubelet skips certificate verification for HTTPS probes.

```yaml
readinessProbe:
  httpGet:
    path: /readyz
    port: https
    scheme: HTTPS
```

Do not probe the [`--https-redirect`](./http-https-redirect.md) port: it accepts only `Host` values listed in `--https-redirect-from-hosts` (default `localhost`), and the kubelet sends the pod IP, so probes get `400 Bad Request`.
