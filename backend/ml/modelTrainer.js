const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

class MLModelTrainer {
  constructor() {
    this.modelPath = path.join(__dirname, "trained_model.json")
    this.pythonScriptPath = path.join(__dirname, "train_model.py")
  }

  // Train the model using Python script
  async trainModel(dataPath = null) {
    return new Promise((resolve, reject) => {
      console.log("🤖 Starting ML model training...")

      const pythonProcess = spawn("python", [this.pythonScriptPath, dataPath || ""])

      let output = ""
      let errorOutput = ""

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString()
        console.log(`Python Output: ${data}`)
      })

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString()
        console.error(`Python Error: ${data}`)
      })

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Model training completed successfully")
          resolve({
            success: true,
            output,
            modelPath: this.modelPath,
          })
        } else {
          console.error("❌ Model training failed")
          reject({
            success: false,
            error: errorOutput,
            code,
          })
        }
      })
    })
  }

  // Load trained model parameters
  loadModel() {
    try {
      if (fs.existsSync(this.modelPath)) {
        const modelData = JSON.parse(fs.readFileSync(this.modelPath, "utf8"))
        return modelData
      }
      return null
    } catch (error) {
      console.error("Error loading model:", error)
      return null
    }
  }

  // Save model parameters
  saveModel(modelData) {
    try {
      fs.writeFileSync(this.modelPath, JSON.stringify(modelData, null, 2))
      return true
    } catch (error) {
      console.error("Error saving model:", error)
      return false
    }
  }
}

module.exports = MLModelTrainer
