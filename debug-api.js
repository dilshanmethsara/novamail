// Debug API endpoint to check what URL is being used
const express = require('express');
const app = express();

app.get('/debug-api-url', (req, res) => {
  const baseUrl = process.env.VITE_API_BASE_URL || 'Not set';
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  
  res.json({
    message: 'API URL Debug',
    environment_variable: baseUrl,
    request_url: fullUrl,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
