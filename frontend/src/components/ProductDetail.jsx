"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Package,
  Calendar,
  Thermometer,
  Droplets,
  MapPin,
  User,
  Phone,
  AlertTriangle,
  Heart,
  DollarSign,
  Star,
  MessageSquare,
  Zap,
  Target,
  Activity,
  Clock,
} from "lucide-react"
import { productsAPI, donationsAPI, mlAPI } from "../utils/api"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mlPrediction, setMlPrediction] = useState(null)
  const [donationMatches, setDonationMatches] = useState([])
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState(20)

  useEffect(() => {
    if (id) {
      fetchProductDetails()
    }
  }, [id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)

      // Fetch product details
      const productResponse = await productsAPI.getById(id)
      setProduct(productResponse.data.product)

      // Fetch ML prediction
      try {
        const mlResponse = await mlAPI.predict(id)
        setMlPrediction(mlResponse.data)
      } catch (mlError) {
        console.log("ML prediction not available:", mlError)
      }

      // Fetch donation matches if product is at risk
      if (productResponse.data.product.predictions?.spoilageRisk > 50) {
        try {
          const matchesResponse = await donationsAPI.getOptimalMatches(id)
          setDonationMatches(matchesResponse.data.matches || [])
        } catch (matchError) {
          console.log("Donation matches not available:", matchError)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyDiscount = async () => {
    try {
      await productsAPI.applyDiscount(id, discountPercentage)
      alert(`✅ ${discountPercentage}% discount applied successfully!`)
      setShowDiscountModal(false)
      await fetchProductDetails() // Refresh data
    } catch (err) {
      alert(`❌ Failed to apply discount: ${err.message}`)
    }
  }

  const handleQuickDonate = async () => {
    try {
      await donationsAPI.quickDonate(id, { quantity: Math.ceil(product.quantity * 0.8) })
      alert("✅ Quick donation created successfully!")
      navigate("/donations")
    } catch (err) {
      alert(`❌ Failed to create donation: ${err.message}`)
    }
  }

  const getRiskColor = (risk) => {
    if (risk >= 85) return "text-red-600 bg-red-100"
    if (risk >= 70) return "text-orange-600 bg-orange-100"
    if (risk >= 50) return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "caution":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <button onClick={() => navigate("/products")} className="bg-green-600 text-white px-4 py-2 rounded-md">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const spoilageRisk = product.predictions?.spoilageRisk || 0
  const daysToExpiry = product.predictions?.daysToExpiry || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">Batch: {product.batch}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium">
                      {product.quantity} {product.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium">${product.price.current}</p>
                    {product.price.discountPercentage > 0 && (
                      <p className="text-sm text-green-600">{product.price.discountPercentage}% discount applied</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-medium">{new Date(product.dates.expiry).toLocaleDateString()}</p>
                    <p className="text-sm text-orange-600">{daysToExpiry} days remaining</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Received</p>
                    <p className="font-medium">{new Date(product.dates.received).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{product.storage.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ML Predictions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">FreshTrack AI Predictions</h2>
            </div>

            {/* Spoilage Risk */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Spoilage Risk</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(spoilageRisk)}`}>
                  {spoilageRisk}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    spoilageRisk >= 85
                      ? "bg-red-500"
                      : spoilageRisk >= 70
                        ? "bg-orange-500"
                        : spoilageRisk >= 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                  style={{ width: `${spoilageRisk}%` }}
                ></div>
              </div>
            </div>

            {/* Prediction Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Urgency Level</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{product.predictions?.urgencyLevel || "MEDIUM"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Confidence</span>
                </div>
                <p className="text-lg font-bold text-green-600">{product.predictions?.confidence || 85}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Last Updated</span>
                </div>
                <p className="text-sm text-purple-600">
                  {product.predictions?.lastPredicted
                    ? new Date(product.predictions.lastPredicted).toLocaleDateString()
                    : "Today"}
                </p>
              </div>
            </div>

            {/* ML Insights */}
            {mlPrediction && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">AI Insights</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>
                    • Environmental factors: Temperature {product.storage.temperature}°C, Humidity{" "}
                    {product.storage.humidity}%
                  </li>
                  <li>• Category sensitivity: {product.category} products have medium spoilage risk</li>
                  <li>
                    • Recommended action:{" "}
                    {spoilageRisk > 80
                      ? "Immediate donation or discount"
                      : spoilageRisk > 60
                        ? "Apply discount within 24h"
                        : "Monitor closely"}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Storage Conditions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Storage Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Thermometer className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-xl font-bold text-gray-900">{product.storage.temperature}°C</p>
                  <p className="text-sm text-green-600">Optimal</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Droplets className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-xl font-bold text-gray-900">{product.storage.humidity}%</p>
                  <p className="text-sm text-green-600">Good</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{product.storage.location}</p>
                  <p className="text-sm text-green-600">Tracked</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Supplier Information</h2>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.supplier.name}</h3>
                <div className="mt-2 space-y-2">
                  {product.supplier.contact && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.supplier.contact}</span>
                    </div>
                  )}
                  {product.supplier.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.supplier.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Feedback */}
          {product.feedback && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Feedback</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">{product.feedback.avgRating}</span>
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-xs text-gray-500">{product.feedback.reviewCount} reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {Math.round(product.feedback.freshnessScore * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Freshness Score</p>
                  <p className="text-xs text-gray-500">Based on customer feedback</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    <MessageSquare className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">Feedback Analysis</p>
                  <p className="text-xs text-gray-500">NLP processed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {spoilageRisk > 50 && (
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Apply Discount</span>
                </button>
              )}

              {spoilageRisk > 40 && (
                <button
                  onClick={handleQuickDonate}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Quick Donate</span>
                </button>
              )}

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Run ML Prediction</span>
              </button>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Spoilage Risk</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(spoilageRisk)}`}>
                  {spoilageRisk}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days to Expiry</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    daysToExpiry <= 2
                      ? "bg-red-100 text-red-800"
                      : daysToExpiry <= 5
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {daysToExpiry} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Action Required</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    spoilageRisk >= 80
                      ? "bg-red-100 text-red-800"
                      : spoilageRisk >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {spoilageRisk >= 80 ? "Urgent" : spoilageRisk >= 60 ? "Soon" : "Monitor"}
                </span>
              </div>
            </div>
          </div>

          {/* Donation Matches */}
          {donationMatches.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Matches</h3>
              <div className="space-y-3">
                {donationMatches.slice(0, 3).map((match) => (
                  <div key={match._id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{match.name}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {match.matchScore}% match
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{match.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{match.estimatedPickupTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Value */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Value</span>
                <span className="font-medium">${(product.price.current * product.quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Original Value</span>
                <span className="font-medium">${(product.price.original * product.quantity).toFixed(2)}</span>
              </div>
              {spoilageRisk > 50 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potential Loss</span>
                  <span className="font-medium text-red-600">
                    ${(product.price.current * product.quantity * (spoilageRisk / 100)).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Discount</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
              <input
                type="range"
                min="10"
                max="70"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>10%</span>
                <span className="font-medium">{discountPercentage}%</span>
                <span>70%</span>
              </div>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Original Price:</span>
                <span>${product.price.current}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New Price:</span>
                <span className="font-medium text-green-600">
                  ${(product.price.current * (1 - discountPercentage / 100)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Savings:</span>
                <span className="font-medium text-red-600">
                  ${(product.price.current * product.quantity * (discountPercentage / 100)).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDiscount}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
