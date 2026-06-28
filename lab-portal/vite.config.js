import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const localSavePlugin = () => {
  const middleware = (req, res, next) => {
    const urlParts = req.url.split('?')[0];
    const pathname = urlParts.replace(/\/$/, '');

    if (req.method === 'POST') {
      if (pathname === '/api/save-labs' || pathname === '/api/save-theory' || pathname === '/api/save-quizzes') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            let filePath = '';
            let content = '';

            if (pathname === '/api/save-labs') {
              filePath = path.resolve(__dirname, 'src/data/labsData.json');
              content = JSON.stringify(data, null, 2);
            } else if (pathname === '/api/save-theory') {
              filePath = path.resolve(__dirname, 'src/data/theoryNotes.js');
              content = `export const theoryNotes = ${JSON.stringify(data, null, 2)};\n`;
            } else if (pathname === '/api/save-quizzes') {
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
      } else if (pathname === '/api/upload-image') {
        import('formidable').then((formidable) => {
          const form = formidable.default ? formidable.default({}) : formidable({});
          form.parse(req, async (err, fields, files) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to parse form data' }));
              return;
            }

            const file = files.file?.[0] || files.file;
            if (!file) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'No file uploaded' }));
              return;
            }

            try {
              const fs = await import('fs');
              const fileBuffer = fs.readFileSync(file.filepath);
              
              const catboxFormData = new FormData();
              catboxFormData.append("reqtype", "fileupload");
              
              const blob = new Blob([fileBuffer], { type: file.mimetype || 'image/png' });
              catboxFormData.append("fileToUpload", blob, file.originalFilename || 'image.png');

              const response = await fetch("https://catbox.moe/user/api.php", {
                method: "POST",
                body: catboxFormData,
              });

              if (!response.ok) {
                throw new Error("Failed to upload to Catbox");
              }

              const url = await response.text();
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ url: url.trim() }));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message || 'Something went wrong during upload' }));
            }
          });
        }).catch((err) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'formidable library error: ' + err.message }));
        });
        return;
      }
    }
    next();
  };

  return {
    name: 'local-save-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localSavePlugin()],
})
