---
outline: deep
---

# Use Relative Root

**`SWS`** resolves and canonicalizes the web root directory to its absolute real path at startup by default and following any intermediate symlinks, so that every subsequent request is validated against a precomputed canonical base without additional filesystem overhead.

The `--use-relative-root` option (or the equivalent [SERVER_USE_RELATIVE_ROOT](./../configuration/env#server_use_relative_root) environment variable) changes this behavior. When enabled, **root directory canonicalization is skipped** at startup. Instead, the root is resolved at request time relative to the server's current working directory.

This unlocks scenarios where the root directory is behind a symlink that you intend to _swap_ at runtime. For example, pointing it to a different directory without restarting the server.

The feature is **disabled by default** (canonicalization is performed) and can be controlled by the boolean `--use-relative-root` option.

## How it works

By default, SWS calls [`canonicalize`][canonicalize] (equivalent to `realpath(3)`) on the root directory at startup:

1. It resolves all symlink components in the root path to their final real path.
2. It stores this canonicalized absolute path as the server's working root.
3. Every incoming request is validated against this precomputed base, ensuring path containment without paying a `canonicalize` syscall per request.

When `--use-relative-root` is enabled, step 1 is skipped. The root path is stored as-is (relative or absolute), symlinked or not and resolved at request time against the process's current working directory.

> [!NOTE] Note
> Regardless of the `--use-relative-root` setting, SWS **always** refuses to serve paths that resolve outside the web root. The [path containment](#symlink-containment-still-enforced) check is always enforced.

## Security implications

When `--use-relative-root` is enabled, the root directory path is not validated or canonicalized before serving requests. This relaxes a built-in safeguard that ensures the server operates from a known, fixed filesystem location.

- **Benefit:** The root directory can be a symlink whose target is swapped at runtime without restarting the server.
- **Trade-off:** The server's working root is no longer anchored to a canonical absolute path. If the current working directory of the process changes (or the symlink target is hijacked), the server could serve files from an unintended location.

> [!WARNING]
> This feature should only be enabled when the dynamic root-swapping behavior is genuinely needed. For most deployments, the default (canonicalization enabled) is the safest choice.

### Additional measures if `--use-relative-root` option is needed

- **Restrict the working directory**: Run SWS from a fixed, non-writable directory so the relative root resolution is predictable.
- **Avoid writable or world-accessible symlink targets**: Ensure the symlink target directories are only writable by trusted processes to prevent symlink hijacking.
- **Harden the filesystem boundary**: Use operating-system-level controls such as `chroot`, containerization, or sandboxing to limit the server's filesystem access.
- **Run as a dedicated user**: Use a non-root user with the least privilege necessary and read-only access to served content.

### Symlink containment still enforced

Even with `--use-relative-root` enabled, **SWS will never follow a symlink that resolves outside the root directory**. The per-request path-containment check still applies, so a symlink pointing above the server root (whether directly or through intermediate components) will be blocked regardless of this setting. This ensures the server cannot escape its designated document tree.

## Use cases

- **Zero-downtime content swaps**: Run SWS with `--root=/srv/current` where `/srv/current` is a symlink. Update the symlink to point to a new release directory, and SWS will serve the new content immediately, no restart needed.
- **Development workflows**: Quickly toggle between different build output directories without restarting the server.
- **Containerized deployments**: Mount a symlink into the container and change its target from the host side without signaling the SWS process.

## Example

```sh
static-web-server \
    --port 8787 \
    --root ./public \
    --log-level info \
    --use-relative-root
```

## TOML configuration

The option can also be set via the [TOML configuration file](./../configuration/file):

```toml
[general]
use-relative-root = true
```

[canonicalize]: https://doc.rust-lang.org/std/path/struct.Path.html#method.canonicalize
