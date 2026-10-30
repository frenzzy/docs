---
outline: deep
---

# Custom HTTP Headers

**SWS** allows customizing the server [HTTP Response headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) on demand.

## Structure

The Server HTTP response headers should be defined mainly as an [Array of Tables](https://toml.io/en/v1.0.0#array-of-tables).

Each table entry should have the following key/value pairs:

- One `source` key containing a string _glob pattern_.
- One `headers` key containing a [set or hash table](https://toml.io/en/v1.0.0#table) describing plain HTTP headers to apply.
- An optional `status` key containing an array of HTTP response status codes.
- An optional `scope` key, either `files` (default) or `all`.

A particular set of HTTP headers can only be applied when a `source` matches against the request URI and, if `status` is defined, the response status code is one of its values.

> [!INFO] Custom HTTP headers take precedence over existing ones
>
> Whatever custom HTTP header could **replace** an existing one if it was previously defined (e.g. server default headers) and matches its `source`.
>
> The header's order is important because determines its precedence.
>
> **Example:** If the feature `--cache-control-headers=true` is enabled but also a custom `cache-control` header was defined then the custom header will have priority.

### Source

The source is a [Glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>) that should match against the URI that is requesting a resource file.

### Headers

A set of valid plain [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) to be applied.

### Status

An optional array of [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) (numbers) that limits the entry to responses with one of those codes, for example `status = [200, 206, 304]`.

Without `status`, the headers apply regardless of the response status, including error responses like `404 Not Found`. This fits headers such as `Strict-Transport-Security`, but not caching headers: an `immutable` `Cache-Control` for `/assets/**` would also be sent with a `404` for a missing asset.

By default, custom headers are not added to responses that SWS returns before serving a file, such as [URL redirects](url-redirects.md), `405 Method Not Allowed` or maintenance mode responses, so a `status` of `301` or `503` never matches those. Use [`scope = "all"`](#scope) to reach them.

To limit caching headers to successful file responses, include `304` next to `200` and `206`: a `304 Not Modified` updates the headers of the response stored by a cache ([RFC 9111, section 4.3.4](https://www.rfc-editor.org/rfc/rfc9111#section-4.3.4)).

SWS validates the codes at startup and fails to start on an empty array or a code outside `100` to `999`.

### Scope

An optional string that selects which responses the entry applies to:

- `files` (default): responses of the static file handler only, including error responses such as `404 Not Found` and plain [URL rewrites](url-rewrites.md), which are served as files.
- `all`: also the responses SWS returns before serving a file: [URL redirects](url-redirects.md), [URL rewrites](url-rewrites.md) with `redirect`, the [health endpoint](health-endpoint.md), the [metrics endpoint](metrics.md), CORS requests rejected with `403 Forbidden`, [Basic Authentication](basic-authentication.md) challenges, [maintenance mode](maintenance-mode.md) and `405 Method Not Allowed`.

These early responses serve no file, so `source` is matched against the request path as is. `scope` can be combined with `status`.

> [!WARNING] Broad patterns
>
> With `scope = "all"`, an entry such as `source = "**"` also reaches responses like the Basic Authentication `401 Unauthorized` challenge, so a header like `Cache-Control` or `WWW-Authenticate` set there applies to it too. Use `status` to limit such entries.

SWS fails to start on a `scope` value other than `files` or `all`.

## Examples

Below are some examples of how to customize server HTTP headers.

### One-line version

```toml
[advanced]

[[advanced.headers]]
source = "**/*.{js,css}"
headers = { Access-Control-Allow-Origin = "*" }
```

### Multiline version

```toml
[advanced]

[[advanced.headers]]
source = "*.html"
[advanced.headers.headers]
Cache-Control = "public, max-age=36000"
Content-Security-Policy = "frame-ancestors 'self'"
Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
```

### Multiline version with explicit header key (dotted)

```toml
[advanced]

[[advanced.headers]]
source = "**/*.{jpg,jpeg,png,ico,gif}"
headers.Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
```

### Limit headers to specific response status codes

```toml
[advanced]

[[advanced.headers]]
source = "/assets/**"
status = [200, 206, 304]
headers = { Cache-Control = "public, max-age=31536000, immutable" }
```

`GET /assets/app.css` returns `200 OK` with `cache-control: public, max-age=31536000, immutable`, while `GET /assets/missing.css` returns `404 Not Found` without the `immutable` directive.

> [!INFO] Fallback page
>
> With a [fallback page](error-pages.md#fallback-page-for-use-with-client-routers) configured, a `GET` for a missing file is answered with `200 OK` and the fallback page, so status filtering does not exclude it.

Entries apply in order and a later entry replaces a header set by an earlier one. Below, every `/assets/**` response gets `no-cache`, and the second entry replaces it with `immutable` for `200`, `206` and `304` responses only.

```toml
[advanced]

[[advanced.headers]]
source = "/assets/**"
headers = { Cache-Control = "no-cache" }

[[advanced.headers]]
source = "/assets/**"
status = [200, 206, 304]
headers = { Cache-Control = "public, max-age=31536000, immutable" }
```

### Apply headers to redirects

Below, a CDN in front of SWS gets a `Cache-Control` for the `301` redirect, which the default `files` scope does not reach.

```toml
[advanced]

[[advanced.redirects]]
source = "/old"
destination = "/new"
kind = 301

[[advanced.headers]]
source = "/old"
status = [301]
scope = "all"
headers = { Cache-Control = "public, max-age=86400" }
```

`GET /old` returns `301 Moved Permanently` with `location: /new` and `cache-control: public, max-age=86400`.
