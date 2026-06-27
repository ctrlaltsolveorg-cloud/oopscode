import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const localSavePlugin = () => ({
  name: 'local-save-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method === 'POST') {
        if (req.url === '/api/save-labs' || req.url === '/api/save-theory' || req.url === '/api/save-quizzes') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              let filePath = '';
              let content = '';

              if (req.url === '/api/save-labs') {
                filePath = path.resolve(__dirname, 'src/data/labsData.json');
                content = JSON.stringify(data, null, 2);
              } else if (req.url === '/api/save-theory') {
                filePath = path.resolve(__dirname, 'src/data/theoryNotes.js');
                content = `export const theoryNotes = ${JSON.stringify(data, null, 2)};\n`;
              } else if (req.url === '/api/save-quizzes') {
                filePath = path.resolve(__dirname, 'src/data/quizzes.js');
                content = `export const quizzes = ${JSON.stringify(data, null, 2)};\n`;
              }

              fs.writeFileSync(filePath, content, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: `Saved ${path.basename(filePath)} successfully!` }));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localSavePlugin()],
})
