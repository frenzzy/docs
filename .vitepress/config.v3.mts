import { DefaultTheme } from "vitepress";

// https://vitepress.dev/reference/site-config
export const v3: DefaultTheme.Config = {
  nav: [
    {
      text: 'v3 (dev)',
      link: '/v3/',
      activeMatch: '^/v3+/',
    },
  ],
  sidebar: {
    '/v3/': [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/v3/' },
          { text: 'Quick Start', link: '/v3/quick-start' },
          { text: 'Download & Install', link: '/v3/download-install' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'CLI Arguments', link: '/v3/configuration/cli' },
          { text: 'Environment Variables', link: '/v3/configuration/env' },
          { text: 'Config File (TOML)', link: '/v3/configuration/file' },
        ],
      },
      { text: 'Server defaults', link: '/v3/defaults' },
      {
        text: 'Building from Source', link: '/v3/building-from-source'
      },
      {
        text: 'Features',
        items: [
          { text: 'HTTP/1', link: '/v3/features/http1' },
          { text: 'HTTP Methods', link: '/v3/features/http-methods' },
          { text: 'TLS', link: '/v3/features/tls' },
          { text: 'HTTP/2', link: '/v3/features/http2' },
          { text: 'HTTP to HTTPS redirect', link: '/v3/features/http-https-redirect' },
          { text: 'Logging', link: '/v3/features/logging' },
          { text: 'Compression', link: '/v3/features/compression' },
          { text: 'Pre-compressed files serving', link: '/v3/features/compression-static' },
          { text: 'Cache Control Headers', link: '/v3/features/cache-control-headers' },
          { text: 'ETag', link: '/v3/features/etag' },
          { text: 'CORS', link: '/v3/features/cors' },
          { text: 'Security Headers', link: '/v3/features/security-headers' },
          { text: 'Basic Authentication', link: '/v3/features/basic-authentication' },
          { text: 'Directory Listing', link: '/v3/features/directory-listing' },
          { text: 'Docker', link: '/v3/features/docker' },
          { text: 'Graceful Shutdown', link: '/v3/features/graceful-shutdown' },
          { text: 'File Descriptor Socket Passing', link: '/v3/features/file-descriptor-socket-passing' },
          { text: 'Unix Domain Socket', link: '/v3/features/unix-domain-socket' },
          { text: 'Worker Threads Customization', link: '/v3/features/worker-threads' },
          { text: 'Blocking Threads Customization', link: '/v3/features/blocking-threads' },
          { text: 'Error Pages', link: '/v3/features/error-pages' },
          { text: 'Custom HTTP Headers', link: '/v3/features/custom-http-headers' },
          { text: 'URL Rewrites', link: '/v3/features/url-rewrites' },
          { text: 'URL Redirects', link: '/v3/features/url-redirects' },
          { text: 'Windows Service', link: '/v3/features/windows-service' },
          { text: 'Trailing Slash Redirect', link: '/v3/features/trailing-slash-redirect' },
          { text: 'Include Hidden Files', link: '/v3/features/include-hidden' },
          { text: 'Follow Symlinks', link: '/v3/features/follow-symlinks' },
          { text: 'Use Relative Root', link: '/v3/features/use-relative-root' },
          { text: 'Health endpoint', link: '/v3/features/health-endpoint' },
          { text: 'Metrics', link: '/v3/features/metrics' },
          { text: 'Virtual Hosting', link: '/v3/features/virtual-hosting' },
          { text: 'Multiple Index Files', link: '/v3/features/multiple-index-files' },
          { text: 'Maintenance Mode', link: '/v3/features/maintenance-mode' },
          { text: 'In-Memory Cache', link: '/v3/features/memory-cache' },
          { text: 'WebAssembly', link: '/v3/features/webassembly' },
          { text: 'Man Pages and Shell Completions', link: '/v3/features/man-pages-completions' },
          { text: 'Markdown Content Negotiation', link: '/v3/features/markdown-content-negotiation' },
          { text: 'Default Charset for Text Responses', link: '/v3/features/text-charset' },
        ]
      },
      { text: 'Platforms & Architectures', link: '/v3/platforms-architectures' },
      { text: 'Migrating from v2 to v3', link: '/v3/migration-guide' },
      { text: 'Changelog v3 (devel)', link: 'https://github.com/static-web-server/static-web-server/blob/master/CHANGELOG.md', target: '_blank', rel: 'noopener noreferrer' },
      { text: 'Semantic Versioning', link: '/v3/semantic-versioning' },
      { text: 'Report Security Issues', link: '/v3/report-security-issues' },
      { text: 'Contributions', link: '/v3/contributions' },
      { text: 'Showcases', link: '/v3/showcases' },
      { text: 'License', link: '/v3/license' },
    ]
  },
};
