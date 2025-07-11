const excelDataService = require("./excelDataService")

class NLPFeedbackService {
  constructor() {
    this.sentimentKeywords = {
      positive: ["fresh", "good", "great", "excellent", "tasty", "quality", "perfect", "love", "best"],
      negative: ["spoiled", "bad", "terrible", "awful", "moldy", "sour", "expired", "waste", "disgusting"],
      freshness: ["fresh", "crisp", "new", "good", "spoiled", "old", "stale", "moldy", "rotten"],
    }
  }

  // Analyze sentiment of review text
  analyzeSentiment(text) {
    if (!text) return { score: 0, sentiment: "neutral" }

    const words = text.toLowerCase().split(/\s+/)
    let positiveScore = 0
    let negativeScore = 0

    words.forEach((word) => {
      if (this.sentimentKeywords.positive.includes(word)) {
        positiveScore++
      } else if (this.sentimentKeywords.negative.includes(word)) {
        negativeScore++
      }
    })

    const totalScore = positiveScore - negativeScore
    const normalizedScore = Math.max(-1, Math.min(1, totalScore / Math.max(1, words.length / 3)))

    let sentiment = "neutral"
    if (normalizedScore > 0.2) sentiment = "positive"
    else if (normalizedScore < -0.2) sentiment = "negative"

    return {
      score: normalizedScore,
      sentiment,
      positiveWords: positiveScore,
      negativeWords: negativeScore,
    }
  }

  // Analyze freshness indicators in reviews
  analyzeFreshness(text) {
    if (!text) return { freshnessScore: 0.5, indicators: [] }

    const words = text.toLowerCase().split(/\s+/)
    const freshnessIndicators = []
    let freshnessScore = 0.5 // neutral

    words.forEach((word) => {
      if (["fresh", "crisp", "new", "good"].includes(word)) {
        freshnessIndicators.push({ word, impact: "positive" })
        freshnessScore += 0.2
      } else if (["spoiled", "old", "stale", "moldy", "rotten"].includes(word)) {
        freshnessIndicators.push({ word, impact: "negative" })
        freshnessScore -= 0.3
      }
    })

    return {
      freshnessScore: Math.max(0, Math.min(1, freshnessScore)),
      indicators: freshnessIndicators,
    }
  }

  // Get comprehensive feedback analysis
  getFeedbackAnalysis() {
    try {
      const feedback = excelDataService.readExcelFile("FreshTrack_Feedback.xlsx")

      const analysis = feedback.map((review) => {
        const sentiment = this.analyzeSentiment(review.review_text)
        const freshness = this.analyzeFreshness(review.review_text)

        return {
          ...review,
          nlpAnalysis: {
            sentiment,
            freshness,
            qualityScore: (review.rating / 5) * 0.6 + sentiment.score * 0.4,
            riskIndicators: sentiment.negativeWords > 0 || freshness.freshnessScore < 0.3,
          },
        }
      })

      // Aggregate by product
      const productAnalysis = analysis.reduce((acc, review) => {
        const productId = review.product_id
        if (!acc[productId]) {
          acc[productId] = {
            productId,
            reviews: [],
            avgSentiment: 0,
            avgFreshness: 0,
            avgRating: 0,
            riskLevel: "low",
          }
        }

        acc[productId].reviews.push(review)
        return acc
      }, {})

      // Calculate aggregates
      Object.keys(productAnalysis).forEach((productId) => {
        const product = productAnalysis[productId]
        const reviews = product.reviews

        product.avgSentiment = reviews.reduce((sum, r) => sum + r.nlpAnalysis.sentiment.score, 0) / reviews.length
        product.avgFreshness =
          reviews.reduce((sum, r) => sum + r.nlpAnalysis.freshness.freshnessScore, 0) / reviews.length
        product.avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

        // Determine risk level
        const riskReviews = reviews.filter((r) => r.nlpAnalysis.riskIndicators).length
        const riskRatio = riskReviews / reviews.length

        if (riskRatio > 0.5 || product.avgFreshness < 0.3) {
          product.riskLevel = "high"
        } else if (riskRatio > 0.2 || product.avgFreshness < 0.6) {
          product.riskLevel = "medium"
        }
      })

      return {
        individualReviews: analysis,
        productAnalysis: Object.values(productAnalysis),
        summary: {
          totalReviews: analysis.length,
          avgSentiment: analysis.reduce((sum, r) => sum + r.nlpAnalysis.sentiment.score, 0) / analysis.length,
          avgFreshness: analysis.reduce((sum, r) => sum + r.nlpAnalysis.freshness.freshnessScore, 0) / analysis.length,
          riskProducts: Object.values(productAnalysis).filter((p) => p.riskLevel === "high").length,
        },
      }
    } catch (error) {
      console.error("Error in NLP feedback analysis:", error)
      return { error: error.message }
    }
  }

  // Get sentiment trends over time
  getSentimentTrends() {
    try {
      const feedback = excelDataService.readExcelFile("FreshTrack_Feedback.xlsx")

      const trends = feedback.reduce((acc, review) => {
        const date = new Date(review.submission_date).toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = {
            date,
            reviews: [],
            avgSentiment: 0,
            avgRating: 0,
          }
        }

        const sentiment = this.analyzeSentiment(review.review_text)
        acc[date].reviews.push({ ...review, sentiment })
        return acc
      }, {})

      // Calculate daily averages
      Object.keys(trends).forEach((date) => {
        const day = trends[date]
        day.avgSentiment = day.reviews.reduce((sum, r) => sum + r.sentiment.score, 0) / day.reviews.length
        day.avgRating = day.reviews.reduce((sum, r) => sum + r.rating, 0) / day.reviews.length
        day.reviewCount = day.reviews.length
      })

      return Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date))
    } catch (error) {
      console.error("Error getting sentiment trends:", error)
      return []
    }
  }
}

module.exports = new NLPFeedbackService()
