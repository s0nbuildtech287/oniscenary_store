import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('dist'));

// API để lấy dữ liệu
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Nếu file chưa tồn tại, tạo mới với mảng rỗng
      await fs.writeFile(DATA_FILE, '[]', 'utf-8');
      res.json([]);
    } else {
      console.error('Error reading data:', error);
      res.status(500).json({ error: 'Failed to read data' });
    }
  }
});

// API để lưu dữ liệu
app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Serve React app cho tất cả các routes không phải API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
