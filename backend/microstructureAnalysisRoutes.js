
const express = require('express');
const router = express.Router();
const pool = require('./database');
console.log('MicrostructureAnalysisRoutes - Database connected successfully');

// Get all microstructure analysis records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM microstructure_analysis ORDER BY analysis_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Create a new microstructure analysis record
router.post('/', async (req, res) => {
  const {
    analysis_date,
    part_name,
    date_code,
    heat_code,
    nodularity_percentage,
    graphite_type,
    count_per_mm2,
    size,
    ferrite_percentage,
    pearlite_percentage,
    carbide,
    remarks,
    disa_line_id
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO microstructure_analysis (
        analysis_date, part_name, date_code, heat_code, nodularity_percentage, graphite_type, count_per_mm2, size, ferrite_percentage, pearlite_percentage, carbide, remarks, disa_line_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [analysis_date, part_name, date_code, heat_code, nodularity_percentage, graphite_type, count_per_mm2, size, ferrite_percentage, pearlite_percentage, carbide, remarks, disa_line_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
     console.error("🔥 Error in /mtructure-analysis route:", err);
    res.status(500).json({ error: err.message });
    res.status(500).json({ error: 'Failed to create record' });
  }
});

module.exports = router;
