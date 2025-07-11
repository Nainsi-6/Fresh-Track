// "use client"
// import { useParams, Link } from "react-router-dom"
// import { ArrowLeft, AlertTriangle, Heart, DollarSign } from "lucide-react"

// const ProductDetail = () => {
//   const { id } = useParams()

//   // Mock data - in real app, fetch based on ID
//   const product = {
//     id: 1,
//     name: "Organic Milk - 2L",
//     category: "Dairy",
//     batch: "MLK-2024-001",
//     expiryDate: "2024-01-15",
//     arrivalDate: "2024-01-10",
//     daysLeft: 1,
//     quantity: 24,
//     spoilageRisk: 95,
//     status: "critical",
//     price: 4.99,
//     supplier: "Fresh Farms Co.",
//     storageTemp: "4°C",
//     humidity: "65%",
//   }

//   const shelfLifeData = [
//     { day: 1, freshness: 100 },
//     { day: 2, freshness: 95 },
//     { day: 3, freshness: 85 },
//     { day: 4, freshness: 70 },
//     { day: 5, freshness: 45 },
//     { day: 6, freshness: 20 },
//     { day: 7, freshness: 5 },
//   ]

//   const customerFeedback = [
//     { id: 1, rating: 4, comment: "Fresh and creamy, great quality!", sentiment: "positive" },
//     { id: 2, rating: 3, comment: "Good but expires quickly", sentiment: "neutral" },
//     { id: 3, rating: 5, comment: "Best organic milk in the store", sentiment: "positive" },
//     { id: 4, rating: 2, comment: "Last batch was sour before expiry", sentiment: "negative" },
//   ]

//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case "positive":
//         return "text-green-600 bg-green-100"
//       case "negative":
//         return "text-red-600 bg-red-100"
//       default:
//         return "text-yellow-600 bg-yellow-100"
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <Link to="/dashboard" className="flex items-center text-green-600 hover:text-green-700 mb-4">
//           <ArrowLeft className="h-5 w-5 mr-2" />
//           Back to Dashboard
//         </Link>
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//             <p className="text-gray-600">
//               {product.category} • Batch: {product.batch}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
//               <Heart className="h-4 w-4 mr-2" />
//               Donate Now
//             </button>
//             <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center">
//               <DollarSign className="h-4 w-4 mr-2" />
//               Apply Discount
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Product Info */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Product Information</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-600">Arrival Date</p>
//                 <p className="font-medium">{product.arrivalDate}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Expiry Date</p>
//                 <p className="font-medium text-red-600">{product.expiryDate}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Days Remaining</p>
//                 <p className="font-medium">{product.daysLeft} days</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Quantity</p>
//                 <p className="font-medium">{product.quantity} units</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Supplier</p>
//                 <p className="font-medium">{product.supplier}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Price</p>
//                 <p className="font-medium">${product.price}</p>
//               </div>
//             </div>
//           </div>

//           {/* Shelf Life Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Shelf Life Prediction</h2>
//             <div className="h-64 relative">
//               <svg className="w-full h-full" viewBox="0 0 400 200">
//                 <defs>
//                   <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                     <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
//                     <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
//                   </linearGradient>
//                 </defs>
//                 <polyline
//                   fill="none"
//                   stroke="#10B981"
//                   strokeWidth="3"
//                   points={shelfLifeData
//                     .map((point, index) => `${index * 60 + 20},${180 - point.freshness * 1.6}`)
//                     .join(" ")}
//                 />
//                 <polygon
//                   fill="url(#gradient)"
//                   points={`20,180 ${shelfLifeData
//                     .map((point, index) => `${index * 60 + 20},${180 - point.freshness * 1.6}`)
//                     .join(" ")} 380,180`}
//                 />
//                 {shelfLifeData.map((point, index) => (
//                   <circle key={index} cx={index * 60 + 20} cy={180 - point.freshness * 1.6} r="4" fill="#10B981" />
//                 ))}
//               </svg>
//               <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-600 px-5">
//                 {shelfLifeData.map((_, index) => (
//                   <span key={index}>Day {index + 1}</span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Customer Feedback */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Customer Feedback Analysis</h2>
//             <div className="space-y-4">
//               {customerFeedback.map((feedback) => (
//                 <div key={feedback.id} className="border-l-4 border-gray-200 pl-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center space-x-2">
//                       <div className="flex">
//                         {[...Array(5)].map((_, i) => (
//                           <span
//                             key={i}
//                             className={`text-sm ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}
//                       >
//                         {feedback.sentiment}
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-gray-700">{feedback.comment}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Risk Assessment */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
//             <div className="text-center">
//               <div className="relative w-32 h-32 mx-auto mb-4">
//                 <svg className="w-32 h-32 transform -rotate-90">
//                   <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
//                   <circle
//                     cx="64"
//                     cy="64"
//                     r="56"
//                     stroke="#EF4444"
//                     strokeWidth="8"
//                     fill="none"
//                     strokeDasharray={`${(product.spoilageRisk / 100) * 351.86} 351.86`}
//                     strokeLinecap="round"
//                   />
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-2xl font-bold text-red-600">{product.spoilageRisk}%</span>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600">Spoilage Risk</p>
//               <div className="mt-4 p-3 bg-red-50 rounded-lg">
//                 <div className="flex items-center text-red-700">
//                   <AlertTriangle className="h-4 w-4 mr-2" />
//                   <span className="text-sm font-medium">High Risk - Immediate Action Required</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Storage Conditions */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Storage Conditions</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Temperature</span>
//                 <span className="font-medium">{product.storageTemp}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Humidity</span>
//                 <span className="font-medium">{product.humidity}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status</span>
//                 <span className="text-green-600 font-medium">Optimal</span>
//               </div>
//             </div>
//           </div>

//           {/* Recommended Actions */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
//             <div className="space-y-3">
//               <div className="p-3 bg-green-50 rounded-lg">
//                 <div className="flex items-center text-green-700 mb-1">
//                   <Heart className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Donate (95% confidence)</span>
//                 </div>
//                 <p className="text-sm text-green-600">3 NGOs nearby can accept this product</p>
//               </div>
//               <div className="p-3 bg-yellow-50 rounded-lg">
//                 <div className="flex items-center text-yellow-700 mb-1">
//                   <DollarSign className="h-4 w-4 mr-2" />
//                   <span className="font-medium">50% Discount (78% confidence)</span>
//                 </div>
//                 <p className="text-sm text-yellow-600">Quick sale recommended</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductDetail


"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, AlertTriangle, Heart, DollarSign, Package, Loader2 } from "lucide-react"
import { productsAPI, donationsAPI, mlAPI } from "../utils/api"

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState({ donate: false, discount: false, predict: false })
  const [donationOpportunities, setDonationOpportunities] = useState([])

  useEffect(() => {
    if (id) {
      fetchProductDetails()
    }
  }, [id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getById(id)
      setProduct(response.data.product)

      // If product has high spoilage risk, get donation opportunities
      if (response.data.product.predictions?.spoilageRisk > 50) {
        try {
          const donationResponse = await donationsAPI.getOptimalMatches(id)
          setDonationOpportunities(donationResponse.data.matches || [])
        } catch (donationError) {
          console.log("No donation matches found")
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDonateNow = async () => {
    try {
      setActionLoading({ ...actionLoading, donate: true })

      // Use quick donate for optimal quantity
      const optimalQuantity = Math.ceil(product.quantity * 0.8)
      await donationsAPI.quickDonate(product._id, { quantity: optimalQuantity })

      alert(`Successfully donated ${optimalQuantity} units of ${product.name}!`)
      await fetchProductDetails() // Refresh product data
    } catch (err) {
      alert(`Donation failed: ${err.message}`)
    } finally {
      setActionLoading({ ...actionLoading, donate: false })
    }
  }

  const handleApplyDiscount = async () => {
    try {
      setActionLoading({ ...actionLoading, discount: true })

      // Calculate optimal discount based on spoilage risk
      const spoilageRisk = product.predictions?.spoilageRisk || 0
      let discountPercentage = 25 // Default

      if (spoilageRisk >= 90) discountPercentage = 50
      else if (spoilageRisk >= 80) discountPercentage = 40
      else if (spoilageRisk >= 70) discountPercentage = 30
      else if (spoilageRisk >= 60) discountPercentage = 25
      else discountPercentage = 15

      await productsAPI.applyDiscount(product._id, discountPercentage)

      alert(`Applied ${discountPercentage}% discount successfully!`)
      await fetchProductDetails() // Refresh product data
    } catch (err) {
      alert(`Failed to apply discount: ${err.message}`)
    } finally {
      setActionLoading({ ...actionLoading, discount: false })
    }
  }

  const handleRunPrediction = async () => {
    try {
      setActionLoading({ ...actionLoading, predict: true })
      await mlAPI.predict(product._id)
      alert("Prediction updated successfully!")
      await fetchProductDetails() // Refresh product data
    } catch (err) {
      alert(`Prediction failed: ${err.message}`)
    } finally {
      setActionLoading({ ...actionLoading, predict: false })
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProductDetails}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Product not found</p>
          <Link to="/products" className="text-green-600 hover:text-green-700 mt-2 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const spoilageRisk = product.predictions?.spoilageRisk || 0
  const daysLeft = Math.ceil((new Date(product.dates.expiry) - new Date()) / (1000 * 60 * 60 * 24))

  // Generate shelf life data for chart
  const shelfLifeData = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    freshness: Math.max(0, 100 - (spoilageRisk / 7) * (i + 1)),
  }))

  // Mock customer feedback (in real app, this would come from API)
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
            <button
              onClick={handleDonateNow}
              disabled={actionLoading.donate}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
            >
              {actionLoading.donate ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Heart className="h-4 w-4 mr-2" />
              )}
              {actionLoading.donate ? "Donating..." : "Donate Now"}
            </button>
            <button
              onClick={handleApplyDiscount}
              disabled={actionLoading.discount}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center disabled:opacity-50"
            >
              {actionLoading.discount ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {actionLoading.discount ? "Applying..." : "Apply Discount"}
            </button>
            <button
              onClick={handleRunPrediction}
              disabled={actionLoading.predict}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
            >
              {actionLoading.predict ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "🔮"}
              {actionLoading.predict ? "Predicting..." : "Update Prediction"}
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
                <p className="font-medium">
                  {new Date(product.dates.received || product.dates.manufactured).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="font-medium text-red-600">{new Date(product.dates.expiry).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="font-medium">{Math.max(0, daysLeft)} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-medium">
                  {product.quantity} {product.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="font-medium">{product.supplier?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium">
                  ${product.price.current}
                  {product.price.discountPercentage > 0 && (
                    <span className="text-sm text-green-600 ml-2">({product.price.discountPercentage}% off)</span>
                  )}
                </p>
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
                    stroke={spoilageRisk > 70 ? "#EF4444" : spoilageRisk > 40 ? "#F59E0B" : "#10B981"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(spoilageRisk / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-2xl font-bold ${spoilageRisk > 70 ? "text-red-600" : spoilageRisk > 40 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {Math.round(spoilageRisk)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Spoilage Risk</p>
              <div
                className={`mt-4 p-3 rounded-lg ${spoilageRisk > 70 ? "bg-red-50" : spoilageRisk > 40 ? "bg-yellow-50" : "bg-green-50"}`}
              >
                <div
                  className={`flex items-center ${spoilageRisk > 70 ? "text-red-700" : spoilageRisk > 40 ? "text-yellow-700" : "text-green-700"}`}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {spoilageRisk > 70
                      ? "High Risk - Immediate Action Required"
                      : spoilageRisk > 40
                        ? "Medium Risk - Monitor Closely"
                        : "Low Risk - Good Condition"}
                  </span>
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
                <span className="font-medium">{product.storage?.temperature || 4}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity</span>
                <span className="font-medium">{product.storage?.humidity || 65}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{product.storage?.location || "Main Storage"}</span>
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
              {spoilageRisk > 50 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-700 mb-1">
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="font-medium">Donate (95% confidence)</span>
                  </div>
                  <p className="text-sm text-green-600">
                    {donationOpportunities.length > 0
                      ? `${donationOpportunities.length} NGOs nearby can accept this product`
                      : "NGOs available for donation"}
                  </p>
                </div>
              )}
              {spoilageRisk > 40 && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center text-yellow-700 mb-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {spoilageRisk > 80 ? "50%" : spoilageRisk > 70 ? "40%" : spoilageRisk > 60 ? "30%" : "25%"}{" "}
                      Discount
                    </span>
                  </div>
                  <p className="text-sm text-yellow-600">Quick sale recommended</p>
                </div>
              )}
              {spoilageRisk <= 40 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-700 mb-1">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="font-medium">Continue Normal Sale</span>
                  </div>
                  <p className="text-sm text-blue-600">Product is in good condition</p>
                </div>
              )}
            </div>
          </div>

          {/* FreshTrack Insights */}
          {product.predictions && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">FreshTrack Insights</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{Math.round(product.predictions.confidence || 85)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Source:</span>
                  <span className="font-medium text-green-600">FreshTrack ML</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {product.predictions.lastPredicted
                      ? new Date(product.predictions.lastPredicted).toLocaleDateString()
                      : "Just now"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
