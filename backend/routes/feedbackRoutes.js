const express = require("express")
const { auth } = require("../middleware/auth")
const nlpFeedbackService = require("../services/nlpFeedbackService")

const router = express.Router()

// Get comprehensive feedback analysis
router.get("/analysis", auth, async (req, res) => {
  try {
    const analysis = nlpFeedbackService.getFeedbackAnalysis()

    res.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to analyze feedback",
      error: error.message,
    })
  }
})

// Get sentiment trends
router.get("/sentiment-trends", auth, async (req, res) => {
  try {
    const trends = nlpFeedbackService.getSentimentTrends()

    res.json({
      success: true,
      data: { trends },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sentiment trends",
      error: error.message,
    })
  }
})

module.exports = router
