const express = require('express');
const router = express.Router();
const pool = require('./database');

// POST endpoint to submit Online Micro Coupon Inspection data

router.post('/api/micro-coupon', async (req, res) => {
    const {
        disa,
        pp_code,
        item_description,
        nodularity_percentage,
        remarks
    } = req.body;

    try {
        // Insert new record
        const result = await pool.query(
            `INSERT INTO online_micro_coupon_inspection (
                disa, pp_code, item_description, nodularity_percentage, remarks
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [disa, pp_code, item_description, nodularity_percentage, remarks]
        );

        if (result.rowCount === 1) {
            res.status(201).json({
                message: 'Online Micro Coupon Inspection data submitted successfully',
                record: result.rows[0]
            });
        } else {
            console.error('Insert failed, result:', result);
            res.status(500).json({ error: 'Failed to insert Micro Coupon Inspection data' });
        }
    } catch (error) {
        console.error('Error submitting Micro Coupon Inspection data:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
    }
});

// GET endpoint to retrieve all Online Micro Coupon Inspection records

router.get('/api/micro-coupon', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM online_micro_coupon_inspection `
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching Micro Coupon Inspection data:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
    }
});

// GET endpoint to retrieve recent records (last 50)

router.get('/api/micro-coupon/recent', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM online_micro_coupon_inspection 
             
             LIMIT 50`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching recent Micro Coupon Inspection data:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
    }
});

// GET endpoint to retrieve records by DISA line

router.get('/api/micro-coupon/by-disa/:disa', async (req, res) => {
    const { disa } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT * FROM online_micro_coupon_inspection 
             WHERE disa = $1 
             ORDER BY record_timestamp DESC`,
            [disa]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching Micro Coupon Inspection data by DISA:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
    }
});

// DELETE endpoint to remove a record

router.delete('/api/micro-coupon/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'DELETE FROM online_micro_coupon_inspection WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rowCount === 1) {
            res.json({
                message: 'Record deleted successfully',
                deletedRecord: result.rows[0]
            });
        } else {
            console.error('Delete failed, result:', result);
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        console.error('Error deleting Micro Coupon Inspection record:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
    }
});

module.exports = router;
