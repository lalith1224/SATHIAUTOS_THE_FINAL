const express = require('express');
const router = express.Router();

const pool = require('./database');

// Test database connection for Inspection Register
pool.connect((err, client, done) => {
    if (err) {
        console.error('InspectionRegisterRoutes - Database connection test failed:', err.stack);
    } else {
        console.log('InspectionRegisterRoutes - Database connected successfully');
        done();
    }
});


// POST endpoint to submit Inspection Register data
router.post('/api/inspection-register', async (req, res) => {
  const { inspection_date, shift, item_description, inspection_time, defects_and_quantity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inspection_register (inspection_date, shift, inspector_name, item_description, inspection_time, defects_and_quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [inspection_date, shift, inspector_name, item_description, inspection_time, defects_and_quantity]
    );
    if (result.rowCount === 1) {
      res.status(201).json({
        message: 'Inspection Register data submitted successfully',
        record: result.rows[0]
      });
    } else {
      res.status(500).json({ error: 'Failed to insert Inspection Register data' });
    }
  } catch (error) {
    console.error('Error submitting Inspection Register data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET endpoint to retrieve all Inspection Register records
router.get('/api/inspection-register', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inspection_register ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Inspection Register data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;