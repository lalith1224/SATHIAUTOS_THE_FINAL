const express = require('express');
const router = express.Router();
const pool = require('./database');
// Test database connection for Error Proof Verification Checklist FDY
pool.connect((err, client, done) => {
    if (err) {
        console.error('ErrorProofVerificationChecklistFDYRoutes - Database connection test failed:', err.stack);
    } else {
        console.log('ErrorProofVerificationChecklistFDYRoutes - Database connected successfully');
        done();
    }
});

// Get all records
router.get('/api/error-proof-verification-checklist-fdy', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "ERROR PROOF VERIFICATION CHECK LIST - FDY" ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Create a new record
router.post('/api/error-proof-verification-checklist-fdy', async (req, res) => {
  const { line, serial_no, error_proof_no, error_proof_name, verification_date_shift, nature_of_error_proof, frequency, date1_shift1_obs, date1_shift2_obs, date1_shift3_obs, date2_shift1_obs, date2_shift2_obs, date2_shift3_obs, date3_shift1_obs, date3_shift2_obs, date3_shift3_obs, problem, root_cause, corrective_action, status, reviewed_by, approved_by, remarks } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO "ERROR PROOF VERIFICATION CHECK LIST - FDY" (
        line, serial_no, error_proof_no, error_proof_name, verification_date_shift, nature_of_error_proof, frequency,
        date1_shift1_obs, date1_shift2_obs, date1_shift3_obs, date2_shift1_obs, date2_shift2_obs, date2_shift3_obs,
        date3_shift1_obs, date3_shift2_obs, date3_shift3_obs, problem, root_cause, corrective_action, status,
        reviewed_by, approved_by, remarks
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
      ) RETURNING *`,
      [line, serial_no, error_proof_no, error_proof_name, verification_date_shift, nature_of_error_proof, frequency,
        date1_shift1_obs, date1_shift2_obs, date1_shift3_obs, date2_shift1_obs, date2_shift2_obs, date2_shift3_obs,
        date3_shift1_obs, date3_shift2_obs, date3_shift3_obs, problem, root_cause, corrective_action, status,
        reviewed_by, approved_by, remarks]
    );
    if (result.rowCount === 1) {
      res.status(201).json({
        message: 'Error Proof Verification Checklist FDY data submitted successfully',
        record: result.rows[0]
      });
    } else {
      res.status(500).json({ error: 'Failed to insert Error Proof Verification Checklist FDY data' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create record' });
             console.error("🔥 Error in /hardness-test-record route:", err);
  }
});

module.exports = router;