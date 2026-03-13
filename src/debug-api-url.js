// Debug script to check what API URL is being used
console.log('=== API URL Debug ===');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
console.log('Window location origin:', window.location.origin);
console.log('===================');

// Test API call
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend health check:', data))
  .catch(error => console.error('Backend health check failed:', error));
