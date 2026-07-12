import { DefaultTheme } from "vitepress";

// https://vitepress.dev/reference/site-config
export const v2: DefaultTheme.Config = {
  nav: [
    {
      text: 'v2',
      link: '/v2/',
      activeMatch: '^/v2+/',
      // items: [
      //   { text: 'Changelog', link: '/v2' },
      // ]
    },
  ],

  sidebar: {
    '/v2/': [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/v2/' },
          { text: 'Getting Started', link: '/v2/getting-started' },
          { text: 'Download & Install', link: '/v2/download-install' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'CLI Arguments', link: '/v2/configuration/command-line-arguments' },
          { text: 'Environment Variables', link: '/v2/configuration/environment-variables' },
          { text: 'Config File (TOML)', link: '/v2/configuration/config-file' },
        ],
      },
      {
        text: 'Building from Source', link: '/v2/building-from-source'
      },
      {
        text: 'Features',
        items: [
          { text: 'HTTP/1', link: '/v2/features/http1' },
          { text: 'HTTP Methods', link: '/v2/features/http-methods' },
          { text: 'HTTP/2 and TLS', link: '/v2/features/http2-tls' },
          { text: 'HTTP to HTTPS redirect', link: '/v2/features/http-https-redirect' },
          { text: 'Logging', link: '/v2/features/logging' },
          { text: 'Compression', link: '/v2/features/compression' },
          { text: 'Pre-compressed files serving', link: '/v2/features/compression-static' },
          { text: 'Cache Control Headers', link: '/v2/features/cache-control-headers' },
          { text: 'CORS', link: '/v2/features/cors' },
          { text: 'Security Headers', link: '/v2/features/security-headers' },
          { text: 'Basic Authentication', link: '/v2/features/basic-authentication' },
          { text: 'Directory Listing', link: '/v2/features/directory-listing' },
          { text: 'Docker', link: '/v2/features/docker' },
          { text: 'Graceful Shutdown', link: '/v2/features/graceful-shutdown' },
          { text: 'File Descriptor Socket Passing', link: '/v2/features/file-descriptor-socket-passing' },
          { text: 'Worker Threads Customization', link: '/v2/features/worker-threads' },
          { text: 'Blocking Threads Customization', link: '/v2/features/blocking-threads' },
          { text: 'Error Pages', link: '/v2/features/error-pages' },
          { text: 'Custom HTTP Headers', link: '/v2/features/custom-http-headers' },
          { text: 'URL Rewrites', link: '/v2/features/url-rewrites' },
          { text: 'URL Redirects', link: '/v2/features/url-redirects' },
          { text: 'Windows Service', link: '/v2/features/windows-service' },
          { text: 'Trailing Slash Redirect', link: '/v2/features/trailing-slash-redirect' },
          { text: 'Ignore Files', link: '/v2/features/ignore-files' },
          { text: 'Disable Symlinks', link: '/v2/features/disable-symlinks' },
          { text: 'Use Relative Root', link: '/v2/features/use-relative-root' },
          { text: 'Health endpoint', link: '/v2/features/health-endpoint' },
          { text: 'Metrics', link: '/v2/features/metrics' },
          { text: 'Virtual Hosting', link: '/v2/features/virtual-hosting' },
          { text: 'Multiple Index Files', link: '/v2/features/multiple-index-files' },
          { text: 'Maintenance Mode', link: '/v2/features/maintenance-mode' },
          { text: 'WebAssembly', link: '/v2/features/webassembly' },
          { text: 'Man Pages and Shell Completions', link: '/v2/features/man-pages-completions' },
          { text: 'Markdown Content Negotiation', link: '/v2/features/markdown-content-negotiation' },
          { text: 'Default Charset for Text Responses', link: '/v2/features/text-charset' },
        ]
      },
      { text: 'Platforms & Architectures', link: '/v2/platforms-architectures' },
      { text: 'Migrating from v1 to v2', link: '/v2/migration' },
      { text: 'Changelog v2 (stable)', link: 'https://github.com/static-web-server/static-web-server/blob/2.x/CHANGELOG.md', target: '_blank', rel: 'noopener noreferrer' },
      { text: 'Semantic Versioning', link: '/v2/semantic-versioning' },
      { text: 'Report Security Issues', link: '/v2/report-security-issues' },
      { text: 'Contributions', link: '/v2/contributions' },
      { text: 'Showcases', link: '/v2/showcases' },
      { text: 'License', link: '/v2/license' },
    ]
  },
};
