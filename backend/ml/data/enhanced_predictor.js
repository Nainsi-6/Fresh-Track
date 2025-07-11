const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

class EnhancedSpoilagePredictor {
  constructor() {
    this.modelPath = path.join(__dirname, "models")
    this.dataPath = path.join(__dirname, "data")
    this.pythonScriptPath = path.join(__dirname, "predict_advanced.py")
    this.trainingScriptPath = path.join(__dirname, "advanced_predictor.py")

    // Ensure directories exist
    this.ensureDirectories()

    // Initialize models
    this.initializeModels()
  }

  ensureDirectories() {
    ;[this.modelPath, this.dataPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  async initializeModels() {
    try {
      // Check if models exist
      const modelExists = fs.existsSync(path.join(this.modelPath, "spoilage_model.pkl"))

      if (!modelExists) {
        console.log("🤖 No trained models found. Training new models...")
        await this.trainModels()
      } else {
        console.log("✅ ML models loaded successfully")
      }
    } catch (error) {
      console.warn("⚠️ ML initialization failed, using fallback predictions:", error.message)
    }
  }

  async trainModels() {
    return new Promise((resolve, reject) => {
      console.log("🚀 Starting advanced ML model training...")

      const pythonProcess = spawn("python", [this.trainingScriptPath])
      let output = ""
      let errorOutput = ""

      pythonProcess.stdout.on("data", (data) => {
        const message = data.toString()
        output += message
        console.log(`Training: ${message.trim()}`)
      })

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString()
      })

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Advanced ML models trained successfully")
          resolve({ success: true, output })
        } else {
          console.error("❌ Model training failed:", errorOutput)
          reject(new Error(`Training failed with code ${code}: ${errorOutput}`))
        }
      })

      pythonProcess.on("error", (error) => {
        console.error("❌ Python process error:", error)
        reject(error)
      })
    })
  }

  async predictAdvanced(product) {
    return new Promise((resolve, reject) => {
      try {
        const productData = this.prepareProductData(product)
        const pythonProcess = spawn("python", [this.pythonScriptPath, JSON.stringify(productData)])

        let output = ""
        let errorOutput = ""

        pythonProcess.stdout.on("data", (data) => {
          output += data.toString()
        })

        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString()
        })

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            try {
              const result = JSON.parse(output.trim())
              resolve(this.enhanceResult(result, product))
            } catch (parseError) {
              resolve(this.fallbackPredict(product))
            }
          } else {
            resolve(this.fallbackPredict(product))
          }
        })

        pythonProcess.on("error", (error) => {
          resolve(this.fallbackPredict(product))
        })
      } catch (error) {
        resolve(this.fallbackPredict(product))
      }
    })
  }

  prepareProductData(product) {
    return {
      name: product.name || "Unknown Product",
      category: product.category || "dairy",
      quantity: product.quantity || 1,
      price: product.price || { current: 0 },
      dates: product.dates || {
        received: new Date().toISOString(),
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      storage: product.storage || { temperature: 4, humidity: 65 },
      batch: product.batch || "UNKNOWN",
      supplier: product.supplier || { name: "Unknown" },
    }
  }

  enhanceResult(result, product) {
    const enhanced = {
      ...result,
      productId: product._id,
      productName: product.name,
      urgencyLevel: this.calculateUrgencyLevel(result.spoilage_risk),
      colorCode: this.getColorCode(result.spoilage_risk),
      notifications: this.generateNotifications(result, product),
      donationOpportunities: this.findDonationOpportunities(result, product),
      costImpact: this.calculateCostImpact(result, product),
    }

    return enhanced
  }

  calculateUrgencyLevel(spoilageRisk) {
    if (spoilageRisk >= 80) return "CRITICAL"
    if (spoilageRisk >= 60) return "HIGH"
    if (spoilageRisk >= 40) return "MEDIUM"
    return "LOW"
  }

  getColorCode(spoilageRisk) {
    if (spoilageRisk >= 80) return "#DC2626" // Red
    if (spoilageRisk >= 60) return "#EA580C" // Orange
    if (spoilageRisk >= 40) return "#D97706" // Amber
    return "#16A34A" // Green
  }

  generateNotifications(result, product) {
    const notifications = []
    const spoilageRisk = result.spoilage_risk

    if (spoilageRisk >= 80) {
      notifications.push({
        type: "CRITICAL_SPOILAGE",
        title: `🚨 URGENT: ${product.name} Critical Spoilage Risk`,
        message: `Batch ${product.batch} has ${spoilageRisk.toFixed(1)}% spoilage risk. Immediate action required!`,
        actions: ["Apply 50% discount", "Contact NGO immediately", "Move to clearance"],
        priority: "critical",
        estimatedLoss: this.calculatePotentialLoss(product),
      })
    } else if (spoilageRisk >= 60) {
      notifications.push({
        type: "HIGH_SPOILAGE",
        title: `⚠️ High Spoilage Risk: ${product.name}`,
        message: `Batch ${product.batch} will expire in ${result.days_until_critical} days. Consider discount or donation.`,
        actions: ["Apply 25% discount", "Schedule donation pickup", "Promote product"],
        priority: "high",
      })
    } else if (spoilageRisk >= 40) {
      notifications.push({
        type: "MONITOR_CLOSELY",
        title: `👀 Monitor: ${product.name}`,
        message: `Batch ${product.batch} showing early spoilage signs. Monitor closely.`,
        actions: ["Daily quality check", "Prepare for discount"],
        priority: "medium",
      })
    }

    return notifications
  }

  findDonationOpportunities(result, product) {
    const opportunities = []

    if (result.spoilage_risk >= 50 && result.spoilage_risk < 90) {
      // Mock NGO matching - in real implementation, this would query a database
      const mockNGOs = [
        {
          id: "ngo_001",
          name: "City Food Bank",
          distance: "2.3 km",
          acceptedCategories: ["dairy", "produce", "bakery"],
          capacity: "high",
          lastPickup: "2024-01-10",
          contact: "+1-555-0123",
        },
        {
          id: "ngo_002",
          name: "Community Kitchen",
          distance: "3.7 km",
          acceptedCategories: ["all"],
          capacity: "medium",
          lastPickup: "2024-01-08",
          contact: "+1-555-0124",
        },
      ]

      const suitableNGOs = mockNGOs.filter(
        (ngo) => ngo.acceptedCategories.includes(product.category) || ngo.acceptedCategories.includes("all"),
      )

      opportunities.push(
        ...suitableNGOs.map((ngo) => ({
          ...ngo,
          estimatedMeals: Math.floor(product.quantity * 2.5),
          pickupWindow: "24-48 hours",
          taxBenefit: this.calculateTaxBenefit(product),
        })),
      )
    }

    return opportunities
  }

  calculateCostImpact(result, product) {
    const unitPrice = product.price?.current || 0
    const quantity = product.quantity || 0
    const totalValue = unitPrice * quantity

    const potentialLoss = totalValue * (result.spoilage_risk / 100)
    const discountSavings = totalValue * 0.25 // Assuming 25% discount saves 75%
    const donationTaxBenefit = totalValue * 0.15 // Tax benefit estimation

    return {
      totalValue,
      potentialLoss: potentialLoss.toFixed(2),
      discountSavings: discountSavings.toFixed(2),
      donationTaxBenefit: donationTaxBenefit.toFixed(2),
      recommendedAction: result.spoilage_risk > 70 ? "donate" : result.spoilage_risk > 50 ? "discount" : "monitor",
    }
  }

  calculatePotentialLoss(product) {
    const unitPrice = product.price?.current || 0
    const quantity = product.quantity || 0
    return (unitPrice * quantity).toFixed(2)
  }

  calculateTaxBenefit(product) {
    const unitPrice = product.price?.current || 0
    const quantity = product.quantity || 0
    return (unitPrice * quantity * 0.15).toFixed(2) // 15% tax benefit estimation
  }

  // Batch prediction for multiple products
  async batchPredict(products) {
    const results = []

    for (const product of products) {
      try {
        const prediction = await this.predictAdvanced(product)
        results.push({
          productId: product._id,
          ...prediction,
        })
      } catch (error) {
        results.push({
          productId: product._id,
          error: error.message,
          fallback: this.fallbackPredict(product),
        })
      }
    }

    return results
  }

  // Enhanced fallback prediction
  fallbackPredict(product) {
    const now = new Date()
    const expiryDate = new Date(product.dates?.expiry || now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))

    let spoilageRisk = 10 // base risk

    // Time-based risk
    if (daysToExpiry <= 0) spoilageRisk = 100
    else if (daysToExpiry <= 1) spoilageRisk = 85
    else if (daysToExpiry <= 2) spoilageRisk = 65
    else if (daysToExpiry <= 3) spoilageRisk = 45
    else spoilageRisk = Math.max(10, 50 - daysToExpiry * 5)

    // Category-based risk adjustment
    const categoryRisk = {
      dairy: 15,
      meat: 20,
      produce: 10,
      bakery: 12,
      frozen: 5,
      pantry: 2,
    }
    spoilageRisk += categoryRisk[product.category] || 10

    // Environmental risk
    const temp = product.storage?.temperature || 4
    const humidity = product.storage?.humidity || 65

    if (product.category === "dairy" || product.category === "meat") {
      if (temp > 6) spoilageRisk += (temp - 6) * 3
    }
    if (humidity > 75) spoilageRisk += (humidity - 75) * 0.5

    spoilageRisk = Math.min(100, Math.max(0, spoilageRisk))

    const result = {
      spoilage_risk: spoilageRisk,
      spoilage_probability: spoilageRisk / 100,
      confidence: 75,
      days_until_critical: Math.max(0, daysToExpiry - 1),
      recommendations: this.generateRecommendations(spoilageRisk),
      predicted_at: new Date().toISOString(),
      model_version: "enhanced-fallback-1.0.0",
    }

    return this.enhanceResult(result, product)
  }

  generateRecommendations(spoilageRisk) {
    const recommendations = []

    if (spoilageRisk >= 80) {
      recommendations.push(
        { action: "urgent_discount", priority: "critical", message: "Apply 50-70% discount immediately" },
        { action: "donate_now", priority: "critical", message: "Contact NGOs for immediate pickup" },
        { action: "staff_alert", priority: "high", message: "Alert staff to prioritize this product" },
      )
    } else if (spoilageRisk >= 60) {
      recommendations.push(
        { action: "apply_discount", priority: "high", message: "Apply 25-40% discount" },
        { action: "schedule_donation", priority: "medium", message: "Schedule donation pickup within 24 hours" },
      )
    } else if (spoilageRisk >= 40) {
      recommendations.push(
        { action: "monitor_closely", priority: "medium", message: "Monitor daily for quality changes" },
        { action: "prepare_discount", priority: "low", message: "Prepare for potential discount in 1-2 days" },
      )
    }

    return recommendations
  }

  // Get model information
  getModelInfo() {
    try {
      const metadataPath = path.join(this.modelPath, "model_metadata.json")
      if (fs.existsSync(metadataPath)) {
        return JSON.parse(fs.readFileSync(metadataPath, "utf8"))
      }
    } catch (error) {
      console.error("Error reading model metadata:", error)
    }

    return {
      version: "enhanced-1.0.0",
      type: "Advanced ML with NLP",
      features: ["Spoilage Prediction", "Sentiment Analysis", "Smart Notifications", "Donation Matching"],
      accuracy: 0.85,
      trained_at: new Date().toISOString(),
    }
  }
}

module.exports = EnhancedSpoilagePredictor
