# Cooling Solutions — GitHub, Vercel, and VS Code package

This ZIP is already compiled. Keep `package.json`, `server.js`, `vercel.json`, and `public/` directly at the project root after extracting it.

## Run from VS Code or any Node.js server

```bash
npm install
npm start
```

The server uses the `PORT` environment variable when one is provided, otherwise it uses port `3000`.

## Deploy with Vercel

### Option A — GitHub import

1. Create a new GitHub repository.
2. Extract this ZIP.
3. Upload the extracted files to the repository root, not the ZIP itself.
4. Import the repository into Vercel.
5. Leave the build settings as detected, or use:
   - Build command: `npm run build`
   - Output directory: `public`
6. Deploy.

The included `vercel.json` keeps the website's client-side routes working and serves the compiled files from `public/`.

### Option B — Vercel CLI

From the extracted project folder:

```bash
npm install
npx vercel
```

## Deploy with GitHub Pages

The ZIP includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

1. Upload the extracted files to a GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. Push to the `main` branch.

The workflow publishes the compiled `public/` folder. For a repository website on a subpath such as `username.github.io/repository-name`, use Vercel or a custom domain for the simplest asset routing.

## Important ZIP format

After extraction, these must be visible immediately:

```text
package.json
server.js
vercel.json
public/
.github/
```

Do not upload the ZIP as a nested folder inside another project.