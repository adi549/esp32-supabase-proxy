// Supabase HTTP Proxy for ESP32
// This converts HTTP requests from ESP32 to HTTPS requests to Supabase

const express = require('express');
const axios = require('axios');
const app = express();

// Middleware
app.use(express.json());

// Your Supabase credentials
const SUPABASE_URL = 'https://unfwrsuxlzmgaoeebhin.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZndyc3V4bHptZ2FvZWViaGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDY4NTIsImV4cCI6MjA3Njk4Mjg1Mn0.JDmrCzwV0hn3KivgWfeMwbEt19Tdyaq4Oa-UuX-XG2k';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    service: 'ESP32 Supabase Proxy',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
});

// GPS locations endpoint - POST
app.post('/gps_locations', async (req, res) => {
  try {
    console.log('📍 GPS Upload:', req.body);
    
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/gps_locations`,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      data: req.body
    });
    
    console.log('✅ Supabase response:', response.status);
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Device status endpoint - PATCH
app.patch('/devices', async (req, res) => {
  try {
    const deviceId = req.query.device_id || 'bike001';
    console.log('📱 Device Status Update:', deviceId, req.body);
    
    const response = await axios({
      method: 'PATCH',
      url: `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${deviceId}`,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      data: req.body
    });
    
    console.log('✅ Device updated:', response.status);
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚲 ESP32 Supabase Proxy Server      ║
║   Port: ${PORT}                           ║
║   Status: READY ✅                     ║
╚════════════════════════════════════════╝
  `);
});
