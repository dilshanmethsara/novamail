const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// API routes - proxy to backend server
app.use('/api', (req, res) => {
  const backend = spawn('node', ['backend/server.js'], {
    stdio: 'pipe',
    env: { ...process.env }
  });
  
  // Handle backend proxy logic here
  res.json({ message: "API proxy - implement backend logic" });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start backend server
const backendServer = spawn('node', ['backend/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: 5001 }
});

app.listen(PORT, () => {
  console.log(`🚀 Nova Mail running on http://localhost:${PORT}`);
  console.log(`📧 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Backend API: http://localhost:${PORT}/api`);
});
