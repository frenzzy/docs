# Use Relative Root

**`SWS`** resolves and canonicalizes the web root directory to its absolute real path at startup by default and following any intermediate symlinks, so that every subsequent request is validated against a precomputed canonical base without additional filesystem overhead.

The `--use-relative-root` option (or the equivalent [SERVER_USE_RELATIVE_ROOT](./../configuration/environment-variables.md#server_use_relative_root) environment variable) changes this behavior. When enabled, **root directory canonicalization is skipped** at startup. Instead, the root is resolved at request time relative to the server's current working directory.

This unlocks scenarios where the root directory is behind a symlink that you intend to _swap_ at runtime. For example, pointing it to a different directory without restarting the server. Since SWS no longer resolves the symlink upfront, the target directory can be changed on the fly and new requests will transparently follow the updated symlink.

The feature is **disabled by default** (canonicalization is performed) and can be controlled by the boolean `--use-relative-root` option.

Example usage:

```sh
static-web-server --port=8787 --root=./public \
    --log-level=info \
    --use-relative-root
```

> [!WARNING] Security considerations
>
> When `--use-relative-root` is enabled, the root directory path is not validated or canonicalized before serving requests. This relaxes a built-in safeguard and shifts the responsibility of path resolution to the runtime.
>
> **You should take additional measures to protect your environment**, such as:
>
> - Ensuring the SWS process runs with a restricted working directory and the least privilege necessary.
> - Avoiding writable or world-accessible symlink targets that could be hijacked by other processes.
> - Hardening the server's filesystem boundary via operating-system-level controls (e.g., `chroot`, containerization, or sandboxing).
> - Only enabling this feature when the dynamic root-swapping behavior is genuinely needed.

> [!INFO] Symlink containment still enforced
>
> Even with `--use-relative-root` enabled, **SWS will never follow a symlink that resolves outside the root directory**. The per-request path-containment check still applies, so a symlink pointing above the server root (whether directly or through intermediate components) will be blocked regardless of this setting. This ensures the server cannot escape its designated document tree.

## Use cases

- **Zero-downtime content swaps**: Run SWS with `--root=/srv/current` where `/srv/current` is a symlink. Update the symlink to point to a new release directory, and SWS will serve the new content immediately, no restart needed.
- **Development workflows**: Quickly toggle between different build output directories without restarting the server.
- **Containerized deployments**: Mount a symlink into the container and change its target from the host side without signaling the SWS process.

## TOML configuration

The option can also be set via the [TOML configuration file](./../configuration/config-file.md):

```toml
[general]
use-relative-root = true
```
