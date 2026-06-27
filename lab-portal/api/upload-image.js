import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: 'Failed to parse form data' });
    }

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
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
      return res.status(200).json({ url: url.trim() });
    } catch (error) {
      console.error("Catbox upload error:", error);
      return res.status(500).json({ error: error.message || 'Something went wrong during upload' });
    }
  });
}
