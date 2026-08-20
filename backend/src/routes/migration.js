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

module.exports = router;
