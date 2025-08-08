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

app.use('/', QF07Router);
app.use('/', QF07FBQ03Router);
app.use('/', timeStudyRouter);
app.use('/', qcRegisterRouter); // Register QC Register routes
app.use('/', microCouponRouter); // Register Micro Coupon routes
app.use('/', inspectionRegisterRouter); // Register Inspection Register routes at /api/inspection-register
app.use('/', tensileTestReportRouter); // Register Tensile Test Report routes
app.use('/api/microstructure-analysis', microstructureAnalysisRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});