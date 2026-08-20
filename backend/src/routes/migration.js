const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, adminOnly } = require('../middleware/auth');

// One-time migration endpoint - run once then remove
router.post('/migrate-college-field', protect, adminOnly, async (req, res) => {
  try {
    // Update all applications that don't have college field
    const result = await Application.updateMany(
      { 
        $or: [
          { college: { $exists: false } },
          { college: null },
          { college: '' }
        ]
      },
      { 
        $set: { college: 'Not Provided' }
      }
    );

    console.log('✅ Migration complete:', result);

    res.json({
      success: true,
      message: 'Migration completed successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Test endpoint to verify deployment
router.get('/test-deployment', protect, adminOnly, async (req, res) => {
  try {
    // Check if delete route exists (by checking router stack)
    const hasDeleteRoute = router.stack.some(layer => 
      layer.route && 
      layer.route.path === '/applications/:id' && 
      layer.route.methods.delete
    );

    // Count applications with/without college
    const [total, withCollege, withoutCollege] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ 
        college: { $exists: true, $ne: null, $ne: '' } 
      }),
      Application.countDocuments({ 
        $or: [
          { college: { $exists: false } },
          { college: null },
          { college: '' }
        ]
      })
    ]);

    // Get latest application to verify college field
    const latestApp = await Application.findOne()
      .sort('-createdAt')
      .select('name email college createdAt');

    res.json({
      success: true,
      deployment: {
        deleteRouteExists: hasDeleteRoute,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      },
      database: {
        totalApplications: total,
        withCollege: withCollege,
        withoutCollege: withoutCollege,
        percentageWithCollege: total > 0 ? Math.round((withCollege / total) * 100) : 0
      },
      latestApplication: latestApp ? {
        name: latestApp.name,
        email: latestApp.email,
        college: latestApp.college || '❌ MISSING',
        createdAt: latestApp.createdAt
      } : null
    });
  } catch (error) {
    console.error('❌ Test deployment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
