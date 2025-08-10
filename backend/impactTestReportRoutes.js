const express = require('express');
const router = express.Router();
const pool = require('./database');
// Test database connection for Impact Test Report
pool.connect((err, client, done) => {
    if (err) {
        console.error('ImpactTestReportRoutes - Database connection test failed:', err.stack);
    } else {
        console.log('ImpactTestReportRoutes - Database connected successfully');
        done();
    }
});

// Get all records
router.get('/api/impact-test-report', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "IMPACT TEST REPORT" ORDER BY inspection_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Create a new record
router.post('/api/impact-test-report', async (req, res) => {
  const { inspection_date, part_name, date_code, specification, observed_value, remarks } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO "IMPACT TEST REPORT" (inspection_date, part_name, date_code, specification, observed_value, remarks)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [inspection_date, part_name, date_code, specification, observed_value, remarks]
    );
    if (result.rowCount === 1) {
      res.status(201).json({
        message: 'Impact Test Report data submitted successfully',
        record: result.rows[0]
      });
    } else {
      res.status(500).json({ error: 'Failed to insert Impact Test Report data' });

    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create record' });
    console.error("🔥 Error in /impact-test-report route:", err);
  }
});

module.exports = router;