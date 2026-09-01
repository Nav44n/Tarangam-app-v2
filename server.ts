import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Middleware for caching and headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Serve static assets from project root
app.use(express.static(process.cwd(), {
  extensions: ['html', 'htm'],
  index: 'index.html'
}));

// Route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Tarangam' });
});

// Fallback / 404 handler
app.use((req, res) => {
  // If requesting an html page that might not have .html extension
  const potentialHtml = path.join(process.cwd(), req.path + '.html');
  if (fs.existsSync(potentialHtml)) {
    return res.sendFile(potentialHtml);
  }
  res.status(404).sendFile(path.join(process.cwd(), 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tarangam server running at http://0.0.0.0:${PORT}`);
});
