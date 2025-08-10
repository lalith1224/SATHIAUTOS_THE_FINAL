const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Use express.json() BEFORE the routes
app.use(express.json());

// ✅ CORS middleware (also before routes)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ✅ Load routes
const QF07Router = require('./QF07_FBQ_02');
const QF07FBQ03Router = require('./QF07_FBQ_03');
const timeStudyRouter = require('./timeStudyRoutes');
const qcRegisterRouter = require('./qcRegisterRoutes'); // Add QC Register routes
const microCouponRouter = require('./microCouponRoutes'); // Add Micro Coupon routes
const inspectionRegisterRouter = require('./inspectionRegisterRoutes');
const tensileTestReportRouter = require('./tensileTestReportRoutes');
const microstructureAnalysisRoutes = require('./microstructureAnalysisRoutes');
const inspectionResultReportRouter = require('./inspectionResultReportRoutes'); // Add Inspection Result Report routes
const impactTestReportRouter = require('./impactTestReportRoutes');
const rejectionAnalysisRegisterRouter = require('./rejectionAnalysisRegisterRoutes');
const hardnessTestRecordRouter = require('./hardnessTestRecordRoutes');
const carbonSulphurLecoAnalysisRegisterRouter = require('./carbonSulphurLecoAnalysisRegisterRoutes');
const errorProofVerificationChecklistFDYRouter = require('./errorProofVerificationChecklistFDYRoutes');

app.use('/', QF07Router);
app.use('/', QF07FBQ03Router);
app.use('/', timeStudyRouter);
app.use('/', qcRegisterRouter); // Register QC Register routes
app.use('/', microCouponRouter); // Register Micro Coupon routes
app.use('/', inspectionRegisterRouter); // Register Inspection Register routes at /api/inspection-register
app.use('/', tensileTestReportRouter); // Register Tensile Test Report routes
app.use('/api/microstructure-analysis', microstructureAnalysisRoutes);
app.use('/', inspectionResultReportRouter); // Register Inspection Result Report routes
app.use('/', impactTestReportRouter); // Register Impact Test Report routes
app.use('/', rejectionAnalysisRegisterRouter); // Register Rejection Analysis Register routes
app.use('/', hardnessTestRecordRouter); // Register Hardness Test Record routes
app.use('/', carbonSulphurLecoAnalysisRegisterRouter); // Register Carbon Sulphur Leco Analysis Register routes
app.use('/', errorProofVerificationChecklistFDYRouter); // Register Error Proof Verification Checklist FDY routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});