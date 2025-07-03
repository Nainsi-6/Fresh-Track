"use client"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, AlertTriangle, Heart, DollarSign } from "lucide-react"

const ProductDetail = () => {
  const { id } = useParams()

  // Mock data - in real app, fetch based on ID
  const product = {
    id: 1,
    name: "Organic Milk - 2L",
    category: "Dairy",
    batch: "MLK-2024-001",
    expiryDate: "2024-01-15",
    arrivalDate: "2024-01-10",
    daysLeft: 1,
    quantity: 24,
    spoilageRisk: 95,
    status: "critical",
    price: 4.99,
    supplier: "Fresh Farms Co.",
    storageTemp: "4°C",
    humidity: "65%",
  }

  const shelfLifeData = [
    { day: 1, freshness: 100 },
    { day: 2, freshness: 95 },
    { day: 3, freshness: 85 },
    { day: 4, freshness: 70 },
    { day: 5, freshness: 45 },
    { day: 6, freshness: 20 },
    { day: 7, freshness: 5 },
  ]

  const customerFeedback = [
    { id: 1, rating: 4, comment: "Fresh and creamy, great quality!", sentiment: "positive" },
    { id: 2, rating: 3, comment: "Good but expires quickly", sentiment: "neutral" },
    { id: 3, rating: 5, comment: "Best organic milk in the store", sentiment: "positive" },
    { id: 4, rating: 2, comment: "Last batch was sour before expiry", sentiment: "negative" },
  ]

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100"
      case "negative":
        return "text-red-600 bg-red-100"
      default:
        return "text-yellow-600 bg-yellow-100"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">
              {product.category} • Batch: {product.batch}
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Donate Now
            </button>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Apply Discount
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Arrival Date</p>
                <p className="font-medium">{product.arrivalDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="font-medium text-red-600">{product.expiryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="font-medium">{product.daysLeft} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-medium">{product.quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="font-medium">{product.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium">${product.price}</p>
              </div>
            </div>
          </div>

          {/* Shelf Life Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shelf Life Prediction</h2>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  points={shelfLifeData
                    .map((point, index) => `${index * 60 + 20},${180 - point.freshness * 1.6}`)
                    .join(" ")}
                />
                <polygon
                  fill="url(#gradient)"
                  points={`20,180 ${shelfLifeData
                    .map((point, index) => `${index * 60 + 20},${180 - point.freshness * 1.6}`)
                    .join(" ")} 380,180`}
                />
                {shelfLifeData.map((point, index) => (
                  <circle key={index} cx={index * 60 + 20} cy={180 - point.freshness * 1.6} r="4" fill="#10B981" />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-600 px-5">
                {shelfLifeData.map((_, index) => (
                  <span key={index}>Day {index + 1}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Customer Feedback Analysis</h2>
            <div className="space-y-4">
              {customerFeedback.map((feedback) => (
                <div key={feedback.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}
                      >
                        {feedback.sentiment}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#EF4444"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(product.spoilageRisk / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600">{product.spoilageRisk}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Spoilage Risk</p>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center text-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">High Risk - Immediate Action Required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Conditions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Storage Conditions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature</span>
                <span className="font-medium">{product.storageTemp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity</span>
                <span className="font-medium">{product.humidity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-medium">Optimal</span>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-700 mb-1">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="font-medium">Donate (95% confidence)</span>
                </div>
                <p className="text-sm text-green-600">3 NGOs nearby can accept this product</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center text-yellow-700 mb-1">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-medium">50% Discount (78% confidence)</span>
                </div>
                <p className="text-sm text-yellow-600">Quick sale recommended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
