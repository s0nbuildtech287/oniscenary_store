import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

function saveJsonPlugin(): Plugin {
  return {
    name: 'save-json-plugin',
    configureServer(server) {
      server.middlewares.use('/api/data', (req, res) => {
        const filePath = path.resolve(process.cwd(), 'data.json');
        if (req.method === 'GET') {
          try {
            if (!fs.existsSync(filePath)) {
              fs.writeFileSync(filePath, '[]', 'utf-8');
            }
            const data = fs.readFileSync(filePath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const json = JSON.parse(body);
              fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Data saved successfully' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react(), saveJsonPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), '.'),
        }
      }
    };
});
