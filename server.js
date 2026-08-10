import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(rootDir, 'public');
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolvePublicFile(requestPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(requestPath);
  } catch {
    return null;
  }

  const relativePath = normalize(decodedPath).replace(/^[/\\]+/, '');
  const filePath = join(publicDir, relativePath);
  const publicPrefix = `${publicDir}${sep}`;

  if (filePath !== publicDir && !filePath.startsWith(publicPrefix)) {
    return null;
  }

  return filePath;
}

const server = createServer((request, response) => {
  if (!request.url || !['GET', 'HEAD'].includes(request.method || '')) {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.end('Method Not Allowed');
    return;
  }

  const requestPath = new URL(
    request.url,
    `http://${request.headers.host || 'localhost'}`,
  ).pathname;
  const requestedFile = resolvePublicFile(requestPath);
  const indexFile = join(publicDir, 'index.html');
  const filePath =
    requestedFile &&
    existsSync(requestedFile) &&
    statSync(requestedFile).isFile()
      ? requestedFile
      : indexFile;

  if (!existsSync(filePath)) {
    response.statusCode = 500;
    response.end('Production files are missing. Ensure the public folder is present.');
    return;
  }

  const extension = extname(filePath).toLowerCase();
  response.statusCode = 200;
  response.setHeader(
    'Content-Type',
    contentTypes[extension] || 'application/octet-stream',
  );
  response.setHeader(
    'Cache-Control',
    extension === '.html'
      ? 'no-cache'
      : 'public, max-age=31536000, immutable',
  );

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Cooling Solutions is running on port ${port}`);
});