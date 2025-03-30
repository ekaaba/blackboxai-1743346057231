const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Admin login
router.post('/api/admin/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // In a real app, this would verify against database
  if (req.body.email !== process.env.ADMIN_EMAIL || 
      req.body.password !== process.env.ADMIN_INITIAL_PASSWORD) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create and return JWT token
  const payload = {
    user: {
      id: 'admin',
      role: 'superadmin'
    }
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

// Serve admin pages (protected routes)
router.get('/admin/dashboard', authenticateAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/dashboard.html'));
});

// API endpoints for admin functionality
router.get('/api/admin/applications', authenticateAdmin, (req, res) => {
  // Return mock data - in real app this would query database
  const applications = [
    {
      id: 'CM-ID-2023-0001',
      name: 'John Doe',
      submitted: '2023-06-15',
      status: 'Pending',
      documents: 3
    },
    {
      id: 'CM-ID-2023-0002',
      name: 'Jane Smith',
      submitted: '2023-06-14',
      status: 'Pending',
      documents: 2
    }
  ];
  res.json(applications);
});

router.patch('/api/admin/approve/:id', authenticateAdmin, (req, res) => {
  // Approve application logic
  res.json({ 
    success: true,
    message: `Application ${req.params.id} approved`
  });
});

router.patch('/api/admin/reject/:id', authenticateAdmin, (req, res) => {
  // Reject application logic
  res.json({ 
    success: true,
    message: `Application ${req.params.id} rejected`
  });
});

module.exports = router;