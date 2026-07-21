<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()

function handleCopy(event: MouseEvent) {
  const btn = event.currentTarget as HTMLButtonElement
  const pre = btn.parentElement?.querySelector('.install-cmd') as HTMLElement | null
  if (!pre) return
  const raw = pre.textContent ?? ''
  const text = raw.replace(/^[ \t]+/gm, '').replace(/^\n+|\n+$/g, '')

  const showSuccess = () => {
    btn.classList.add('ok')
    const span = btn.querySelector('span')
    if (span) span.textContent = 'Copied'
    setTimeout(() => {
      btn.classList.remove('ok')
      if (span) span.textContent = 'Copy'
    }, 1400)
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(showSuccess).catch(() => fallbackCopy(text, showSuccess))
  } else {
    fallbackCopy(text, showSuccess)
  }
}

function fallbackCopy(text: string, onSuccess: () => void) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    onSuccess()
  } catch (err) {
    console.error('Fallback copy failed:', err)
  }
  document.body.removeChild(ta)
}
</script>

<template>
  <div class="sws-page" :data-theme="isDark ? 'dark' : 'light'">
    <main>
      <!-- HERO -->
      <section id="top" class="sws-hero">
        <div class="sws-container sws-hero-grid">
          <div class="sws-hero-text">
            <h1>Static content delivery with speed &amp; <span class="sws-accent">reliability</span></h1>

            <p class="sws-lead">
              Deliver static websites confidently with a modern and Open Source web server designed for
              secure, efficient, and reliable deployments across platforms.
            </p>

            <div class="sws-actions">
              <a class="sws-btn sws-btn-primary" href="#install">Get started</a>
              <a class="sws-btn sws-btn-ghost" href="https://github.com/static-web-server/static-web-server"
                target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
                  <path
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.69-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.09 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.61.23 2.79.11 3.09.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
                GitHub
              </a>
            </div>

            <ul class="sws-meta">
              <li>~4MB binary</li>
              <li>No dependencies</li>
              <li>MIT / Apache-2.0</li>
            </ul>
          </div>

          <div class="sws-hero-art">
            <figure class="sws-window">
              <figcaption class="sws-window-bar">
                <span class="sws-window-name">~/site — static-web-server</span>
                <span class="sws-window-controls" aria-hidden="true">
                  <span class="sws-win-btn">—</span>
                  <span class="sws-win-btn">▢</span>
                  <span class="sws-win-btn sws-win-close">✕</span>
                </span>
              </figcaption>
              <pre
                class="sws-code"><span class="sws-t-prompt">$</span> <span class="sws-t-cmd">static-web-server</span> <span class="sws-t-flag">--port=</span><span class="sws-t-num">8080</span> <span class="sws-t-flag">--root=</span><span class="sws-t-str">./public</span> <span class="sws-t-flag">--log=</span><span class="sws-t-str">info</span>
<span class="sws-t-dim">{"timestamp":"2026-06-12T11:38:03.543447Z","level":"INFO","message":"starting Static Web Server","name":"static-web-server","version":"2.43.0","target":"static_web_server::server"}</span>
<span class="sws-t-dim">{"timestamp":"2026-06-12T11:38:03.544833Z","level":"INFO","message":"log level","log_level":"info","target":"static_web_server::server"}</span>
<span class="sws-t-dim">{"timestamp":"2026-06-12T11:38:03.545077Z","level":"INFO","message":"server bound to tcp socket","addr":"[::]:8787","target":"static_web_server::server::listener"}</span></pre>
            </figure>
          </div>
        </div>
      </section>

      <!-- WHY -->
      <section id="why" class="sws-section sws-alt">
        <div class="sws-container">
          <header class="sws-head">
            <p class="sws-kicker">Why Static Web Server</p>
            <h2>Designed to deliver static content easily</h2>
            <p class="sws-sub">A handful of reasons teams pick SWS to ship sites and web assets in production.</p>
          </header>

          <div class="sws-grid sws-grid-4">
            <article class="sws-card">
              <span class="sws-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
                </svg>
              </span>
              <h3>High performance</h3>
              <p>Built with Rust for efficient Async I/O and excellent performance.</p>
            </article>

            <article class="sws-card">
              <span class="sws-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2 4 5v7c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V5l-8-3z" fill="currentColor" />
                </svg>
              </span>
              <h3>Safe by default</h3>
              <p>Memory-safe, opinionated server defaults, TLS, security headers, Basic Auth and more.</p>
            </article>

            <article class="sws-card">
              <span class="sws-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.8 3.3L12 10.8 5.2 7.5 12 4.2Zm-7 5.1 6 2.9v8.2l-6-3v-8.1Zm14 0v8.1l-6 3v-8.2l6-2.9Z"
                    fill="currentColor" />
                </svg>
              </span>
              <h3>Lightweight &amp; portable</h3>
              <p>Single ~4MB static binary, no runtime dependencies. Drops into any distro or Docker container.</p>
            </article>

            <article class="sws-card">
              <span class="sws-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M3 5h18v3H3zM3 10h12v3H3zM3 15h18v3H3z" fill="currentColor" />
                </svg>
              </span>
              <h3>Easy to set up</h3>
              <p>CLI flags, environment variables or a TOML file. Sensible defaults with no boilerplate.</p>
            </article>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section id="features" class="sws-section">
        <div class="sws-container">
          <header class="sws-head">
            <p class="sws-kicker">Features</p>
            <h2>Batteries included, zero clutter</h2>
            <p class="sws-sub">A curated set of features for modern static hosting to opt in when you need them.</p>
          </header>

          <div class="sws-grid sws-grid-4">
            <div class="sws-feature">
              <h3>HTTP/2 &amp; TLS</h3>
              <p>Modern protocols with HTTPS redirects out of the box.</p>
            </div>
            <div class="sws-feature">
              <h3>Smart compression</h3>
              <p>On-demand <code>gzip</code>, <code>brotli</code> and <code>zstd</code> support.</p>
            </div>
            <div class="sws-feature">
              <h3>Pre-compressed files</h3>
              <p>Serve <code>.gz</code>, <code>.br</code> and <code>.zst</code> straight from disk.</p>
            </div>
            <div class="sws-feature">
              <h3>Cache-Control &amp; ETag</h3>
              <p>Tune browser caching for assets and HTML.</p>
            </div>

            <div class="sws-feature">
              <h3>CORS &amp; preflight</h3>
              <p>Configure origins, methods &amp; headers with full preflight.</p>
            </div>
            <div class="sws-feature">
              <h3>Basic Auth</h3>
              <p>Protect a directory in a single line of configuration.</p>
            </div>
            <div class="sws-feature">
              <h3>Security headers</h3>
              <p>Sensible defaults you can opt into for production.</p>
            </div>
            <div class="sws-feature">
              <h3>SPA fallback</h3>
              <p>Serve <code>index.html</code> on 404 for React, Vue, Svelte.</p>
            </div>

            <div class="sws-feature">
              <h3>Rewrites &amp; Redirects</h3>
              <p>Glob patterns with replacements for clean URLs.</p>
            </div>
            <div class="sws-feature">
              <h3>Health &amp; Metrics</h3>
              <p>Health endpoint and Prometheus metrics built in.</p>
            </div>
            <div class="sws-feature">
              <h3>Virtual hosts</h3>
              <p>Serve multiple sites from one process via host routing.</p>
            </div>
            <div class="sws-feature">
              <h3>Directory listing</h3>
              <p>Optional listing with sorting and JSON output.</p>
            </div>

            <div class="sws-feature">
              <h3>Custom HTTP Headers</h3>
              <p>Set custom headers for client responses on demand.</p>
            </div>
            <div class="sws-feature">
              <h3>Markdown Content</h3>
              <p>Serve Markdown or HTML based on the client's <code>Accept</code> header.</p>
            </div>
            <div class="sws-feature">
              <h3>First-class Docker support</h3>
              <p>Docker images for a variety of platforms and architectures.</p>
            </div>
            <div class="sws-feature">
              <h3>Maintenance Mode</h3>
              <p>Display a custom page for users while performing updates.</p>
            </div>

            <div class="sws-feature">
              <h3>Windows Service</h3>
              <p>Run natively as a managed Windows Service.</p>
            </div>
            <div class="sws-feature sws-feature-new"><span class="sws-tag">New</span>
              <h3>In-memory caching</h3>
              <p>Cache frequently accessed files in memory for faster response times.</p>
            </div>
            <div class="sws-feature sws-feature-new"><span class="sws-tag">New</span>
              <h3>FIPS-validated crypto</h3>
              <p>Optional FIPS 140 builds for regulated workloads.</p>
            </div>
            <div class="sws-feature sws-feature-new"><span class="sws-tag">New</span>
              <h3>Unix Domain Sockets</h3>
              <p>Listen on a UDS for fast, secure local proxying.</p>
            </div>
          </div>
          <br />
          <p>
            <a class="sws-link-arrow" href="/v3/features/http1/">
              See more features →
            </a>
          </p>
        </div>
      </section>

      <!-- CONFIG -->
      <section id="config" class="sws-section sws-alt">
        <div class="sws-container sws-two-col">
          <div>
            <p class="sws-kicker">Configuration</p>
            <h2>One file. Production-ready.</h2>
            <p class="sws-sub">
              Describe the whole server configuration in one readable TOML or skip it and pass directly a few
              flags or environment variables.
            </p>
            <ul class="sws-check-list">
              <li>CLI args, environment variables, or TOML. Pick what fits.</li>
              <li>One option each per feature set.</li>
              <li>Zero-config quickstart, point it at a folder and go.</li>
            </ul>
            <a class="sws-link-arrow" href="/v3/configuration/file/">
              See all options →
            </a>
          </div>

          <figure class="sws-window">
            <figcaption class="sws-window-bar">
              <span class="sws-window-name">sws.toml</span>
              <span class="sws-window-controls" aria-hidden="true">
                <span class="sws-win-btn">—</span>
                <span class="sws-win-btn">▢</span>
                <span class="sws-win-btn sws-win-close">✕</span>
              </span>
            </figcaption>
            <pre class="sws-code"><code><span class="sws-t-num">[general]</span>
<span class="sws-t-comment"># Bind &amp; serve</span>
<span class="sws-t-key">host</span> = <span class="sws-t-str">"0.0.0.0"</span>
<span class="sws-t-key">port</span> = <span class="sws-t-num">80</span>
<span class="sws-t-key">root</span> = <span class="sws-t-str">"./public"</span>

<span class="sws-t-comment"># Performance</span>
<span class="sws-t-key">compression</span>           = <span class="sws-t-bool">true</span>
<span class="sws-t-key">cache-control-headers</span> = <span class="sws-t-bool">true</span>
<span class="sws-t-key">http2</span>                 = <span class="sws-t-bool">true</span>

<span class="sws-t-comment"># Security</span>
<span class="sws-t-key">security-headers</span> = <span class="sws-t-bool">true</span>
<span class="sws-t-key">basic-auth</span>       = <span class="sws-t-str">"user:hashed-pass"</span>

<span class="sws-t-comment"># SPA support</span>
<span class="sws-t-key">page-fallback</span> = <span class="sws-t-str">"./public/index.html"</span></code></pre>
          </figure>
        </div>
      </section>

      <!-- PLATFORMS -->
      <section class="sws-section">
        <div class="sws-container">
          <header class="sws-head">
            <p class="sws-kicker">Runs anywhere</p>
            <h2>Pre-built for every platform you ship to</h2>
            <p class="sws-sub">Native binaries and Docker images for desktops, servers, mobile and the web.</p>
          </header>

          <ul class="sws-pills" aria-label="Supported platforms">
            <li>Linux</li>
            <li>macOS</li>
            <li>Windows</li>
            <li>FreeBSD</li>
            <li>NetBSD</li>
            <li>Android</li>
            <li>Docker</li>
            <li>WebAssembly</li>
          </ul>

          <p class="sws-note">
            Pre-compiled binaries for <code>x86</code>, <code>x86_64</code>, <code>ARM</code> and
            <code>ARM64</code>.
            Docker images on <code>scratch</code>, <code>Alpine</code> and <code>Debian</code>.
          </p>
        </div>
      </section>

      <!-- INSTALL -->
      <section id="install" class="sws-section sws-alt">
        <div class="sws-container">
          <header class="sws-head sws-center">
            <p class="sws-kicker">Get started</p>
            <h2>Up and running in under a minute</h2>
            <p class="sws-sub">Install with one command in <b>Linux/BSD</b>, then point it at any folder of static
              files.</p>
          </header>

          <div class="sws-install-line sws-install-no-space" role="group" aria-label="Quick install">
            <pre
              class="install-cmd sws-code"><span class="sws-t-cmd">curl</span> <span class="sws-t-dim">--proto</span> <span class="sws-t-str">'=https'</span> <span class="sws-t-dim">--tlsv1.2 -sSfL https://get.static-web-server.net</span> <span class="sws-t-num">|</span> <span class="sws-t-cmd">sh</span></pre>
            <button class="sws-copy-btn" type="button" aria-label="Copy install command" @click="handleCopy">
              <svg class="sws-i-copy" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
                <rect x="4" y="4" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
              </svg>
              <svg class="sws-i-check" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Copy</span>
            </button>
          </div>

          <div class="sws-head sws-center">
            <p class="sws-sub">Or visit <a class="sws-link-arrow"
                href="/v3/download-install/">
                the installation page
              </a> for other platforms and installation methods.
            </p>
          </div>

          <div class="sws-head sws-center">
            <p class="sws-sub">If you use Docker, then try</p>
          </div>

          <div class="sws-install-line" role="group" aria-label="Quick install Docker">
            <pre
              class="install-cmd sws-code"><span class="sws-t-cmd">docker</span> <span class="sws-t-dim">run -p</span> <span class="sws-t-num">8080</span>:<span class="sws-t-num">80</span> <span class="sws-t-dim">-v</span> <span class="sws-t-key">$PWD</span><span class="sws-t-dim">:/public ghcr.io/static-web-server/static-web-server:2</span></pre>
            <button class="sws-copy-btn" type="button" aria-label="Copy Docker command" @click="handleCopy">
              <svg class="sws-i-copy" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
                <rect x="4" y="4" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
              </svg>
              <svg class="sws-i-check" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Copy</span>
            </button>
          </div>

          <div class="sws-actions sws-center">
            <a class="sws-btn sws-btn-primary" href="/v3/">Read the docs</a>
            <a class="sws-btn sws-btn-ghost" href="/v3/download-install/">Download binaries</a>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="sws-footer">
      <div class="sws-container sws-footer-row">
        <a class="sws-brand" href="#top" aria-label="Static Web Server — home">
          <img class="sws-logo sws-logo-dark" src="/assets/sws_white.svg" alt="" width="22" height="22" />
          <img class="sws-logo sws-logo-light" src="/assets/sws.svg" alt="" width="22" height="22" />
          <span>Static Web Server</span>
        </a>

        <nav class="sws-footer-nav" aria-label="Footer">
          <a href="/v3/">Docs</a>
          <a href="https://github.com/static-web-server/static-web-server" target="_blank" rel="noopener">GitHub</a>
          <a href="/v3/download-install/">Releases</a>
          <a href="https://hub.docker.com/r/joseluisq/static-web-server" target="_blank" rel="noopener">Docker Hub</a>
          <a href="https://crates.io/crates/static-web-server" target="_blank" rel="noopener">Crates.io</a>
          <a href="https://discord.gg/VWvtZeWAA7" target="_blank" rel="noopener">Discord</a>
        </nav>

        <p class="sws-footer-meta">
          Copyright &copy; 2019-2026 <a href="https://static-web-server.net" target="_blank"
            rel="noopener">Static Web Server</a> | Dual-licensed
          <a href="https://github.com/static-web-server/static-web-server/blob/master/LICENSE-MIT" target="_blank"
            rel="noopener">MIT</a> /
          <a href="https://github.com/static-web-server/static-web-server/blob/master/LICENSE-APACHE" target="_blank"
            rel="noopener">Apache-2.0</a>.
        </p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
  /*  */
</style>
