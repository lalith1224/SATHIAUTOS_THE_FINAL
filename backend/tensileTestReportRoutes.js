const express = require('express');
const router = express.Router();
const pool = require('./database');

// Test database connection for Tensile Test Report
pool.connect((err, client, done) => {
    if (err) {
        console.error('TensileTestReportRoutes - Database connection test failed:', err.stack);
    } else {
        console.log('TensileTestReportRoutes - Database connected successfully');
        done();
    }
});

// POST endpoint to submit a tensile test report
router.post('/api/tensile-test-report', async (req, res) => {
  const {
    inspection_date, item_id, heat_code,
    diameter_mm, initial_length_mm, final_length_mm,
    breaking_load_kn, yield_load_kn, uts_n_mm2, ys_n_mm2, elongation_percent,
    remarks
  } = req.body;
  try {
    // Get product description from master_data
    const prodRes = await pool.query('SELECT product_description FROM master_data WHERE product_code = $1', [item_id]);
    if (!prodRes.rows[0]) {
      return res.status(400).json({ error: 'Invalid item_id' });
    }
    const item = prodRes.rows[0].product_description;
    const result = await pool.query(
      `INSERT INTO tensile_test_report (
        inspection_date, item_id, item, heat_code,
        diameter_mm, initial_length_mm, final_length_mm,
        breaking_load_kn, yield_load_kn, uts_n_mm2, ys_n_mm2, elongation_percent,
        remarks
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [inspection_date, item_id, item, heat_code, diameter_mm, initial_length_mm, final_length_mm, breaking_load_kn, yield_load_kn, uts_n_mm2, ys_n_mm2, elongation_percent, remarks]
    );
    if (result.rowCount === 1) {
      res.status(201).json({
        message: 'Tensile Test Report submitted successfully',
        record: result.rows[0]
      });
    } else {
      res.status(500).json({ error: 'Failed to insert Tensile Test Report' });
    }
  } catch (error) {
    console.error('Error submitting Tensile Test Report:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET endpoint to fetch all tensile test reports (with product description)
router.get('/api/tensile-test-report', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ttr.*, md.product_description
      FROM tensile_test_report ttr
      LEFT JOIN master_data md ON ttr.item_id = md.product_code
      ORDER BY ttr.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Tensile Test Reports:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET endpoint to fetch all products for dropdown
router.get('/api/master-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT product_code, product_description FROM master_data ORDER BY product_description');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;