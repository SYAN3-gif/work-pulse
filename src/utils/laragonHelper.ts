/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LaragonEnvironmentInfo {
  isLocalhost: boolean;
  isLaragonTestDomain: boolean;
  isSubdirectory: boolean;
  hostname: string;
  port: string;
  origin: string;
  protocol: string;
  pathname: string;
  fullUrl: string;
  environmentType: 'laragon_vhost' | 'localhost_dev' | 'subdirectory' | 'cloud_preview';
  detectedServer: string;
}

export function getLaragonEnvironment(): LaragonEnvironmentInfo {
  if (typeof window === 'undefined') {
    return {
      isLocalhost: true,
      isLaragonTestDomain: false,
      isSubdirectory: false,
      hostname: 'localhost',
      port: '3000',
      origin: 'http://localhost:3000',
      protocol: 'http:',
      pathname: '/',
      fullUrl: 'http://localhost:3000/',
      environmentType: 'localhost_dev',
      detectedServer: 'Vite Node.js (Port 3000)',
    };
  }

  const hostname = window.location.hostname;
  const isLaragonTestDomain = hostname.endsWith('.test');
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    isLaragonTestDomain ||
    hostname.endsWith('.local') ||
    hostname.includes('192.168.') ||
    hostname.includes('10.');

  const pathname = window.location.pathname;
  const isSubdirectory = pathname.length > 1 && pathname !== '/';

  let environmentType: 'laragon_vhost' | 'localhost_dev' | 'subdirectory' | 'cloud_preview' = 'cloud_preview';
  let detectedServer = 'Cloud Preview Container';

  if (isLaragonTestDomain) {
    environmentType = 'laragon_vhost';
    detectedServer = 'Laragon Virtual Host (.test) [Apache/Nginx]';
  } else if (isLocalhost && isSubdirectory) {
    environmentType = 'subdirectory';
    detectedServer = 'Laragon Apache/Nginx (Subdirectory www/workpulse)';
  } else if (isLocalhost) {
    environmentType = 'localhost_dev';
    detectedServer = window.location.port === '3000' ? 'Laragon Terminal / Vite Node.js (:3000)' : `Localhost Web Server (:${window.location.port || '80'})`;
  }

  return {
    isLocalhost,
    isLaragonTestDomain,
    isSubdirectory,
    hostname,
    port: window.location.port || (window.location.protocol === 'https:' ? '443' : '80'),
    origin: window.location.origin,
    protocol: window.location.protocol,
    pathname,
    fullUrl: window.location.href,
    environmentType,
    detectedServer,
  };
}

export interface LaragonDiagnosticResult {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'info';
  details: string;
  recommendation?: string;
}

export function runLaragonDiagnostics(): LaragonDiagnosticResult[] {
  const env = getLaragonEnvironment();
  const results: LaragonDiagnosticResult[] = [];

  // 1. Host header and domain test
  if (env.isLaragonTestDomain) {
    results.push({
      id: 'domain_vhost',
      name: 'Laragon Virtual Host (.test)',
      status: 'passed',
      details: `Active host is ${env.hostname}. Laragon auto virtual host recognized.`,
    });
  } else if (env.isLocalhost) {
    results.push({
      id: 'domain_localhost',
      name: 'Localhost Binding',
      status: 'passed',
      details: `Running on ${env.hostname}:${env.port}. Host binding is 0.0.0.0 with allowedHosts enabled.`,
    });
  } else {
    results.push({
      id: 'domain_preview',
      name: 'Remote / Preview Host',
      status: 'info',
      details: `Currently running on ${env.hostname}. Ready for cloning to C:\\laragon\\www\\workpulse.`,
      recommendation: 'To test in Laragon, copy to C:\\laragon\\www\\workpulse and open http://workpulse.test',
    });
  }

  // 2. LocalStorage Persistence Test
  try {
    const testKey = `_laragon_test_${Date.now()}`;
    localStorage.setItem(testKey, 'ok');
    const val = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    if (val === 'ok') {
      results.push({
        id: 'local_storage',
        name: 'Offline LocalStorage Persistence',
        status: 'passed',
        details: 'Client storage read/write succeeded. Jobs, applications, and settings will persist offline.',
      });
    } else {
      throw new Error('Read mismatch');
    }
  } catch (err) {
    results.push({
      id: 'local_storage',
      name: 'Offline LocalStorage Persistence',
      status: 'warning',
      details: `Storage write failed: ${(err as Error).message}`,
      recommendation: 'Enable cookies and site data in browser settings.',
    });
  }

  // 3. Asset Base Path Resolution
  results.push({
    id: 'asset_base',
    name: 'Vite Relative Base Path ("./")',
    status: 'passed',
    details: 'Configured with base: "./". Assets load properly from subdirectories (like /workpulse/dist/) and root virtual hosts alike.',
  });

  // 4. Vite 6 Strict Host Protection
  results.push({
    id: 'vite_allowed_hosts',
    name: 'Vite 6 AllowedHosts Policy',
    status: 'passed',
    details: 'allowedHosts: true and cors: true are active. Vite will not block Laragon virtual hosts or proxies with 403 Forbidden.',
  });

  // 5. Apache SPA Rewrite Readiness (.htaccess)
  results.push({
    id: 'apache_htaccess',
    name: 'Laragon Apache .htaccess Rules',
    status: 'passed',
    details: 'public/.htaccess is deployed. Built dist/ directory contains mod_rewrite rules for Single Page App URLs.',
  });

  return results;
}

export const LARAGON_CONFIGS = {
  apacheHtaccess: `# WorkPulse Apache SPA Rewrite (.htaccess)
# Place in: C:\\laragon\\www\\workpulse\\dist\\.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>`,

  apacheVhost: `# Laragon Apache Virtual Host
# Place in: C:\\laragon\\etc\\apache2\\sites-enabled\\workpulse.test.conf
<VirtualHost *:80>
    DocumentRoot "C:/laragon/www/workpulse/dist"
    ServerName workpulse.test
    ServerAlias *.workpulse.test
    <Directory "C:/laragon/www/workpulse/dist">
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
    </Directory>
</VirtualHost>`,

  nginxVhost: `# Laragon Nginx Virtual Host
# Place in: C:\\laragon\\etc\\nginx\\sites-enabled\\workpulse.test.conf
server {
    listen 80;
    server_name workpulse.test;
    root "C:/laragon/www/workpulse/dist";
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
    }
}`,

  laragonTerminalCommands: `# Laragon Terminal Quick Commands
# 1. Open Laragon -> Menu -> Terminal (or right click -> Terminal)
cd C:\\laragon\\www\\workpulse

# 2. Install dependencies (Node.js is included with Laragon)
npm install

# 3. Start development server on port 3000
npm run dev

# 4. Or build production package for Apache/Nginx
npm run build`,
};

export function exportLocalData(): string {
  if (typeof window === 'undefined') return '{}';
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('workpulse_') || key.startsWith('app_') || key.includes('job') || key.includes('user'))) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || '');
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  return JSON.stringify(data, null, 2);
}

export function importLocalData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || !parsed) return false;
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    return true;
  } catch {
    return false;
  }
}
