const express = require("express")
const { auth } = require("../middleware/auth")
const excelDataService = require("../services/excelDataService")

const router = express.Router()

// Get all NGOs
router.get("/", auth, async (req, res) => {
  try {
    const ngos = excelDataService.getNGOData()

    res.json({
      success: true,
      data: {
        ngos,
        summary: {
          total: ngos.length,
          totalDonations: ngos.reduce((sum, ngo) => sum + (ngo.donationCount || 0), 0),
          totalQuantity: ngos.reduce((sum, ngo) => sum + (ngo.totalQuantity || 0), 0),
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO data",
      error: error.message,
    })
  }
})

// Get single NGO by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const ngos = excelDataService.getNGOData()
    const ngo = ngos.find((n) => n._id === req.params.id)

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      })
    }

    res.json({
      success: true,
      data: { ngo },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO",
      error: error.message,
    })
  }
})

// Rate NGO
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body

    // In real implementation, update the database/Excel file
    res.json({
      success: true,
      message: "NGO rated successfully",
      data: {
        ngoId: id,
        rating,
        ratedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to rate NGO",
      error: error.message,
    })
  }
})

// Get NGO performance
router.get("/:id/performance", auth, async (req, res) => {
  try {
    const { id } = req.params
    const donations = excelDataService.readExcelFile("FreshTrack_Donations.xlsx")

    // Filter donations for this NGO
    const ngoName = id.replace("ngo_", "").replace(/_/g, " ")
    const ngoDonations = donations.filter((d) => d.ngo_name.toLowerCase().includes(ngoName.toLowerCase()))

    const performance = {
      totalDonations: ngoDonations.length,
      totalQuantity: ngoDonations.reduce((sum, d) => sum + (d.quantity || 0), 0),
      totalValue: ngoDonations.reduce((sum, d) => sum + (d.quantity || 0) * 5.99, 0),
      avgResponseTime: "2.5 hours",
      reliability: "95%",
      lastPickup: ngoDonations.length > 0 ? ngoDonations[ngoDonations.length - 1].pickup_date : null,
    }

    res.json({
      success: true,
      data: { performance },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get NGO performance",
      error: error.message,
    })
  }
})

module.exports = router
