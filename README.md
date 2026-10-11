# WorkPulse - Job Search & Enterprise Platform (Laragon & Localhost Ready)

WorkPulse is a digital employment ecosystem built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

It is fully configured and optimized to run on **Laragon** (Windows WAMP/LAMP stack), supporting both **Laragon Virtual Hosts** (`http://workpulse.test`), **Apache/Nginx static distribution hosting**, and the **Laragon Node.js Terminal** (`http://localhost:3000`).

---

## 🚀 Quickstart: Running in Laragon (Windows)

Laragon is usually installed at `C:\laragon` with its web root at `C:\laragon\www`.

### Option 1: Live Dev Server via Laragon Terminal (Fastest)
Laragon bundles Node.js, npm, and git out-of-the-box:

1. Copy or clone this repository into:
   ```cmd
   C:\laragon\www\workpulse
   ```
2. In Laragon, right-click the system tray icon or window &rarr; select **Terminal** (or Menu &rarr; Terminal).
3. In the terminal, run:
   ```bash
   cd C:\laragon\www\workpulse
   npm install
   npm run dev
   ```
4. Open your browser at:
   - **http://localhost:3000**
   - or **http://127.0.0.1:3000**

> **Note on Vite 6:** Vite 6 restricts unknown host headers by default. This project has `allowedHosts: true`, `cors: true`, and `host: '0.0.0.0'` enabled in `vite.config.ts`, so requests from `localhost`, `127.0.0.1`, and Laragon `.test` virtual host domains will never be blocked by a `403 Forbidden` error.

---

### Option 2: Automatic Laragon Virtual Host (`http://workpulse.test`)

Laragon automatically detects folders placed in `C:\laragon\www\` and creates a virtual host named `foldername.test`:

1. Build the production package inside the project directory:
   ```bash
   npm run build
   ```
   This generates the compiled Single Page Application inside the `dist/` directory, including the pre-configured Apache `.htaccess` rewrite file and relative asset links (`base: './'`).

2. In Laragon, click **Start All** (starts Apache and MySQL).
   - Laragon will automatically add `workpulse.test` to your Windows `hosts` file.
   - By default, Laragon will map `http://workpulse.test` to `C:\laragon\www\workpulse`.

3. **Setting DocumentRoot to `dist` (Recommended for Apache)**:
   - To have `http://workpulse.test` serve the built app directly, save the following in `C:\laragon\etc\apache2\sites-enabled\workpulse.test.conf` (or use the one in the repository `laragon-apache-vhost.conf`):
     ```apache
     <VirtualHost *:80>
         DocumentRoot "C:/laragon/www/workpulse/dist"
         ServerName workpulse.test
         ServerAlias *.workpulse.test
         <Directory "C:/laragon/www/workpulse/dist">
             AllowOverride All
             Require all granted
             Options -Indexes +FollowSymLinks
         </Directory>
     </VirtualHost>
     ```
   - Right-click Laragon &rarr; **Apache** &rarr; **Reload**.
   - Browse to **http://workpulse.test**.

---

### Option 3: Subdirectory Access via Apache (`http://localhost/workpulse/dist/`)

Because `vite.config.ts` is configured with `base: './'`, asset URLs are resolved relatively. You can also view the app through:
- **http://localhost/workpulse/dist/**
All CSS stylesheets, JS bundles, and SVG logos will resolve without 404 path mismatch errors.

---

### Option 4: Laragon 1-Click SSL (`https://workpulse.test`)

To test secure HTTPS in Laragon:
1. Click **Laragon Menu** &rarr; **Apache** &rarr; **SSL** &rarr; **Enabled**.
2. Laragon automatically creates a local certificate authority and trusted cert.
3. Open **https://workpulse.test** in your browser.

---

## 🛠 In-App Laragon Hub & Diagnostics

WorkPulse contains a dedicated **Laragon & Localhost Hub** directly accessible inside the web application:
- Click the **Laragon Hub** button in the top navigation bar.
- Or visit `http://localhost:3000/?laragon=true` to open it immediately.

### Features inside the Laragon Hub:
- **Live Diagnostics**: Checks host binding, CORS status, Vite 6 AllowedHosts, and LocalStorage offline persistence.
- **Copyable Configs**: 1-click copy for `.htaccess`, Apache VirtualHost, and Nginx VirtualHost.
- **Local Testing & Simulation**: Trigger mock candidate applications and recruiter interview invitations to test real-time audio and toast notifications locally.
- **Data Portability**: Export and import your local test state as a JSON file.

---

## 📁 Repository Configuration Files for Laragon
- `vite.config.ts`: Configured with `base: './'`, `host: '0.0.0.0'`, `port: 3000`, `allowedHosts: true`, and open CORS headers.
- `public/.htaccess`: Auto-copied to `dist/.htaccess` during build to handle SPA client-side routing on Apache in Laragon.
- `laragon-apache-vhost.conf`: Ready-to-use Apache VirtualHost template.
- `laragon-nginx-vhost.conf`: Ready-to-use Nginx configuration template for users running Laragon with Nginx.
