const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Serve static pages
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/index.html'));
});

router.get('/apply', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/apply.html'));
});

router.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/track.html'));
});

router.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/faq.html'));
});

// API endpoints
router.post('/api/apply', (req, res) => {
  // Process application form submission
  res.json({ 
    success: true,
    applicationId: `CM-ID-${Date.now()}`,
    message: 'Application submitted successfully' 
  });
});

router.post('/api/upload', upload.array('documents', 3), (req, res) => {
  // Process document uploads
  res.json({ 
    success: true,
    message: 'Documents uploaded successfully' 
  });
});

router.get('/api/track/:id', (req, res) => {
  // Retrieve application status
  const statuses = [
    { stage: 'Submitted', date: new Date(Date.now() - 86400000), completed: true },
    { stage: 'Under Review', date: new Date(Date.now() - 43200000), completed: true },
    { stage: 'Approved', date: new Date(), completed: true },
    { stage: 'Printing', date: null, completed: false },
    { stage: 'Dispatched', date: null, completed: false },
    { stage: 'Delivered', date: null, completed: false }
  ];
  
  res.json({
    success: true,
    applicationId: req.params.id,
    status: 'Approved',
    statuses,
    estimatedCompletion: new Date(Date.now() + 2419200000) // 4 weeks from now
  });
});

module.exports = router;