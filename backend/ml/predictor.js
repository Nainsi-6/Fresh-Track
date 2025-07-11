// const fs = require("fs")
// const path = require("path")
// const { spawn } = require("child_process")

// class SpoilagePredictor {
//   constructor() {
//     this.modelMetadataPath = path.join(__dirname, "trained_model.json")
//     this.modelPicklePath = path.join(__dirname, "trained_model.pkl")
//     this.predictScriptPath = path.join(__dirname, "predict.py")
//     this.modelMetadata = this.loadModelMetadata()
//   }

//   loadModelMetadata() {
//     try {
//       if (fs.existsSync(this.modelMetadataPath)) {
//         return JSON.parse(fs.readFileSync(this.modelMetadataPath, "utf8"))
//       }
//       return null
//     } catch (error) {
//       console.error("Error loading model metadata:", error)
//       return null
//     }
//   }

//   // Prepare features for prediction based on product data
//   prepareFeatures(product) {
//     const features = {}

//     // Basic numerical features
//     features.quantity = product.inventory?.quantity || 0
//     features.price = product.pricing?.retail || 0
//     features.temperature = product.storage?.temperature || 4
//     features.humidity = product.storage?.humidity || 65

//     // Calculate days to expiry
//     const now = new Date()
//     const expiryDate = new Date(product.dates.expiry)
//     features.days_to_expiry_from_arrival = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)))

//     // One-hot encoded categorical features
//     const categories = ["Bakery", "Dairy", "Frozen", "Meat", "Produce"]
//     categories.forEach((cat) => {
//       features[`category_${cat}`] = product.category === cat ? 1 : 0
//     })

//     // Store features (assuming store IDs)
//     const stores = ["S002", "S003", "S004"]
//     stores.forEach((store) => {
//       features[`store_id_${store}`] = 0 // Default to 0, can be set based on actual store
//     })

//     return features
//   }

//   // Predict spoilage using Python model
//   async predict(product) {
//     return new Promise((resolve, reject) => {
//       if (!this.modelMetadata) {
//         return reject(new Error("Model not loaded. Please train the model first."))
//       }

//       const features = this.prepareFeatures(product)
//       const featuresJson = JSON.stringify(features)

//       const pythonProcess = spawn("python", [this.predictScriptPath, featuresJson])

//       let output = ""
//       let errorOutput = ""

//       pythonProcess.stdout.on("data", (data) => {
//         output += data.toString()
//       })

//       pythonProcess.stderr.on("data", (data) => {
//         errorOutput += data.toString()
//       })

//       pythonProcess.on("close", (code) => {
//         if (code === 0) {
//           try {
//             const result = JSON.parse(output.trim())
//             resolve({
//               spoilageRisk: Math.round(result.spoilage_probability * 100),
//               confidence: Math.round(result.confidence * 100),
//               daysLeft: features.days_to_expiry_from_arrival,
//               modelVersion: this.modelMetadata.version,
//               predictedAt: new Date().toISOString(),
//               features: features,
//             })
//           } catch (parseError) {
//             reject(new Error(`Failed to parse prediction result: ${parseError.message}`))
//           }
//         } else {
//           reject(new Error(`Prediction failed: ${errorOutput}`))
//         }
//       })
//     })
//   }

//   // Batch prediction for multiple products
//   async batchPredict(products) {
//     const predictions = []

//     for (const product of products) {
//       try {
//         const prediction = await this.predict(product)
//         predictions.push({
//           productId: product._id,
//           ...prediction,
//         })
//       } catch (error) {
//         predictions.push({
//           productId: product._id,
//           error: error.message,
//         })
//       }
//     }

//     return predictions
//   }

//   // Get model information
//   getModelInfo() {
//     return this.modelMetadata
//   }

//   // Fallback prediction using JavaScript (when Python model is not available)
//   fallbackPredict(product) {
//     const features = this.prepareFeatures(product)

//     // Simple rule-based prediction as fallback
//     let spoilageRisk = 10 // base risk

//     // Time-based risk
//     if (features.days_to_expiry_from_arrival <= 1) spoilageRisk += 60
//     else if (features.days_to_expiry_from_arrival <= 2) spoilageRisk += 40
//     else if (features.days_to_expiry_from_arrival <= 3) spoilageRisk += 25

//     // Category-based risk
//     if (features.category_Dairy) spoilageRisk += 20
//     if (features.category_Produce) spoilageRisk += 15
//     if (features.category_Meat) spoilageRisk += 25

//     // Environmental factors
//     if (features.temperature > 8) spoilageRisk += 15
//     if (features.humidity > 75) spoilageRisk += 10

//     // Quality factors
//     if (product.quality?.freshness < 80) {
//       spoilageRisk += (100 - product.quality.freshness) * 0.3
//     }

//     spoilageRisk = Math.min(100, Math.max(0, spoilageRisk))

//     return {
//       spoilageRisk: Math.round(spoilageRisk),
//       confidence: 75, // Lower confidence for fallback
//       daysLeft: features.days_to_expiry_from_arrival,
//       modelVersion: "fallback-1.0.0",
//       predictedAt: new Date().toISOString(),
//       features: features,
//     }
//   }
// }

// module.exports = SpoilagePredictor

const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

class SpoilagePredictor {
  constructor() {
    this.modelMetadataPath = path.join(__dirname, "trained_model.json")
    this.modelPicklePath = path.join(__dirname, "trained_model.pkl")
    this.predictScriptPath = path.join(__dirname, "predict.py")
    this.modelMetadata = this.loadModelMetadata()
  }

  loadModelMetadata() {
    try {
      if (fs.existsSync(this.modelMetadataPath)) {
        return JSON.parse(fs.readFileSync(this.modelMetadataPath, "utf8"))
      }
      return null
    } catch (error) {
      console.error("Error loading model metadata:", error)
      return null
    }
  }

  // Prepare features for prediction based on product data
  prepareFeatures(product) {
    const features = {}

    // Basic numerical features
    features.quantity = product.quantity || 0
    features.price = product.price?.current || product.price?.original || 0
    features.temperature = product.storage?.temperature || 4
    features.humidity = product.storage?.humidity || 65

    // Calculate days to expiry
    const now = new Date()
    const expiryDate = new Date(product.dates.expiry)
    features.days_to_expiry_from_arrival = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)))

    // One-hot encoded categorical features
    const categories = ["dairy", "meat", "produce", "bakery", "frozen"]
    categories.forEach((cat) => {
      features[`category_${cat}`] = product.category?.toLowerCase() === cat ? 1 : 0
    })

    // Store features (assuming store IDs)
    const stores = ["S002", "S003", "S004"]
    stores.forEach((store) => {
      features[`store_id_${store}`] = 0 // Default to 0, can be set based on actual store
    })

    return features
  }

  // Predict spoilage using Python model
  async predict(product) {
    return new Promise((resolve, reject) => {
      try {
        const features = this.prepareFeatures(product)
        const featuresJson = JSON.stringify(features)

        const pythonProcess = spawn("python", [this.predictScriptPath, featuresJson])
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
              resolve({
                spoilageRisk: Math.round(result.spoilage_probability * 100),
                confidence: Math.round(result.confidence * 100),
                daysLeft: features.days_to_expiry_from_arrival,
                modelVersion: this.modelMetadata?.version || "1.0.0",
                predictedAt: new Date().toISOString(),
                features: features,
              })
            } catch (parseError) {
              // Fallback to rule-based prediction
              resolve(this.fallbackPredict(product))
            }
          } else {
            // Fallback to rule-based prediction
            resolve(this.fallbackPredict(product))
          }
        })

        pythonProcess.on("error", (error) => {
          // Fallback to rule-based prediction
          resolve(this.fallbackPredict(product))
        })
      } catch (error) {
        // Fallback to rule-based prediction
        resolve(this.fallbackPredict(product))
      }
    })
  }

  // Batch prediction for multiple products
  async batchPredict(products) {
    const predictions = []
    for (const product of products) {
      try {
        const prediction = await this.predict(product)
        predictions.push({
          productId: product._id,
          ...prediction,
        })
      } catch (error) {
        predictions.push({
          productId: product._id,
          error: error.message,
        })
      }
    }
    return predictions
  }

  // Get model information
  getModelInfo() {
    return this.modelMetadata
  }

  // Fallback prediction using JavaScript (when Python model is not available)
  fallbackPredict(product) {
    const features = this.prepareFeatures(product)

    // Simple rule-based prediction as fallback
    let spoilageRisk = 10 // base risk

    // Time-based risk
    if (features.days_to_expiry_from_arrival <= 1) spoilageRisk += 60
    else if (features.days_to_expiry_from_arrival <= 2) spoilageRisk += 40
    else if (features.days_to_expiry_from_arrival <= 3) spoilageRisk += 25

    // Category-based risk
    if (features.category_dairy) spoilageRisk += 20
    if (features.category_produce) spoilageRisk += 15
    if (features.category_meat) spoilageRisk += 25

    // Environmental factors
    if (features.temperature > 8) spoilageRisk += 15
    if (features.humidity > 75) spoilageRisk += 10

    spoilageRisk = Math.min(100, Math.max(0, spoilageRisk))

    return {
      spoilageRisk: Math.round(spoilageRisk),
      confidence: 75, // Lower confidence for fallback
      daysLeft: features.days_to_expiry_from_arrival,
      modelVersion: "fallback-1.0.0",
      predictedAt: new Date().toISOString(),
      features: features,
    }
  }
}

module.exports = SpoilagePredictor
