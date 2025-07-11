// "use client"

// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { Search, Filter, AlertTriangle, Clock, Heart, Package } from "lucide-react"

// const Dashboard = () => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")

//   const products = [
//     {
//       id: 1,
//       name: "Organic Milk - 2L",
//       category: "Dairy",
//       batch: "MLK-2024-001",
//       expiryDate: "2024-01-15",
//       daysLeft: 1,
//       quantity: 24,
//       spoilageRisk: 95,
//       status: "critical",
//       price: 4.99,
//       discountApplied: false,
//     },
//     {
//       id: 2,
//       name: "Fresh Bread Loaves",
//       category: "Bakery",
//       batch: "BRD-2024-045",
//       expiryDate: "2024-01-16",
//       daysLeft: 2,
//       quantity: 18,
//       spoilageRisk: 78,
//       status: "warning",
//       price: 2.49,
//       discountApplied: true,
//     },
//     {
//       id: 3,
//       name: "Bananas - Premium",
//       category: "Produce",
//       batch: "BAN-2024-089",
//       expiryDate: "2024-01-18",
//       daysLeft: 4,
//       quantity: 45,
//       spoilageRisk: 45,
//       status: "good",
//       price: 1.99,
//       discountApplied: false,
//     },
//     {
//       id: 4,
//       name: "Greek Yogurt Cups",
//       category: "Dairy",
//       batch: "YOG-2024-023",
//       expiryDate: "2024-01-14",
//       daysLeft: 0,
//       quantity: 12,
//       spoilageRisk: 98,
//       status: "expired",
//       price: 5.99,
//       discountApplied: false,
//     },
//   ]

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "critical":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "warning":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       case "good":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "expired":
//         return "bg-gray-100 text-gray-800 border-gray-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getRiskColor = (risk) => {
//     if (risk >= 80) return "text-red-600"
//     if (risk >= 50) return "text-yellow-600"
//     return "text-green-600"
//   }

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesFilter = filterStatus === "all" || product.status === filterStatus
//     return matchesSearch && matchesFilter
//   })

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Dashboard</h1>
//         <p className="text-gray-600">Monitor product freshness and take proactive actions</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Critical Items</p>
//               <p className="text-2xl font-bold text-red-600">2</p>
//             </div>
//             <AlertTriangle className="h-8 w-8 text-red-500" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Expiring Soon</p>
//               <p className="text-2xl font-bold text-yellow-600">1</p>
//             </div>
//             <Clock className="h-8 w-8 text-yellow-500" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Ready to Donate</p>
//               <p className="text-2xl font-bold text-green-600">3</p>
//             </div>
//             <Heart className="h-8 w-8 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Items</p>
//               <p className="text-2xl font-bold text-blue-600">99</p>
//             </div>
//             <Package className="h-8 w-8 text-blue-500" />
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter className="h-5 w-5 text-gray-400" />
//             <select
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="critical">Critical</option>
//               <option value="warning">Warning</option>
//               <option value="good">Good</option>
//               <option value="expired">Expired</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Days Left
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Risk Score
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Quantity
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProducts.map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       <div className="text-sm text-gray-500">
//                         {product.category} • {product.batch}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(product.status)}`}
//                     >
//                       {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {product.daysLeft === 0 ? "Expired" : `${product.daysLeft} days`}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`text-sm font-medium ${getRiskColor(product.spoilageRisk)}`}>
//                       {product.spoilageRisk}%
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity} units</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <Link to={`/product/${product.id}`} className="text-blue-600 hover:text-blue-900">
//                       Details
//                     </Link>
//                     {product.status === "critical" && (
//                       <>
//                         <button className="text-green-600 hover:text-green-900">Donate</button>
//                         <button className="text-yellow-600 hover:text-yellow-900">Discount</button>
//                       </>
//                     )}
//                     {product.status === "warning" && (
//                       <button className="text-yellow-600 hover:text-yellow-900">
//                         {product.discountApplied ? "Remove Discount" : "Apply Discount"}
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { Package, AlertTriangle, Heart, DollarSign, BarChart3, Zap } from "lucide-react"
// import { productsAPI, analyticsAPI, mlAPI } from "../utils/api"
// import { useAuth } from "../hooks/useAuth.jsx"

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null)
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const { user } = useAuth()

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)

//       // Fetch dashboard analytics
//       const analyticsResponse = await analyticsAPI.getDashboard({ period: "30" })
//       setDashboardData(analyticsResponse.data)

//       // Fetch recent products
//       const productsResponse = await productsAPI.getAll({
//         limit: 10,
//         sortBy: "createdAt",
//         sortOrder: "desc",
//       })
//       setProducts(productsResponse.data.products)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const runMLPredictions = async () => {
//     try {
//       await mlAPI.batchPredict({ limit: 50 })
//       // Refresh data after predictions
//       fetchDashboardData()
//     } catch (err) {
//       console.error("ML prediction error:", err)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const stats = dashboardData?.overview || {}

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
//           <p className="text-gray-600 mt-2">Here's what's happening with your inventory today.</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
//               </div>
//               <Package className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Critical Items</p>
//                 <p className="text-3xl font-bold text-red-600">{stats.criticalCount || 0}</p>
//               </div>
//               <AlertTriangle className="h-12 w-12 text-red-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Value</p>
//                 <p className="text-3xl font-bold text-green-600">${(stats.totalValue || 0).toLocaleString()}</p>
//               </div>
//               <DollarSign className="h-12 w-12 text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Avg Risk</p>
//                 <p className="text-3xl font-bold text-orange-600">{Math.round(stats.avgSpoilageRisk || 0)}%</p>
//               </div>
//               <BarChart3 className="h-12 w-12 text-orange-600" />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 mb-8">
//           <button
//             onClick={runMLPredictions}
//             className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
//           >
//             <Zap className="h-5 w-5" />
//             <span>Run ML Predictions</span>
//           </button>

//           <Link
//             to="/analytics"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//           >
//             <BarChart3 className="h-5 w-5" />
//             <span>View Analytics</span>
//           </Link>

//           <Link
//             to="/donations"
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//           >
//             <Heart className="h-5 w-5" />
//             <span>Manage Donations</span>
//           </Link>
//         </div>

//         {/* Recent Products */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Risk
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Expiry
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                         <div className="text-sm text-gray-500">Batch: {product.batch}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {product.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           product.status === "critical"
//                             ? "bg-red-100 text-red-800"
//                             : product.status === "warning"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {product.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {product.predictions?.spoilageRisk || 0}%
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(product.dates.expiry).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900">
//                         View Details
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { Package, AlertTriangle, Heart, DollarSign, BarChart3, Zap } from "lucide-react"
// import { productsAPI, analyticsAPI, mlAPI } from "../utils/api"
// import { useAuth } from "../hooks/useAuth"

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null)
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const { user } = useAuth()

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)

//       // Fetch dashboard analytics
//       const analyticsResponse = await analyticsAPI.getDashboard({ period: "30" })
//       setDashboardData(analyticsResponse.data)

//       // Fetch recent products
//       const productsResponse = await productsAPI.getAll({
//         limit: 10,
//         sortBy: "createdAt",
//         sortOrder: "desc",
//       })
//       setProducts(productsResponse.data.products)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const runMLPredictions = async () => {
//     try {
//       await mlAPI.batchPredict({ limit: 50 })
//       // Refresh data after predictions
//       fetchDashboardData()
//     } catch (err) {
//       console.error("ML prediction error:", err)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const stats = dashboardData?.overview || {}

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
//           <p className="text-gray-600 mt-2">Here's what's happening with your inventory today.</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
//               </div>
//               <Package className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Critical Items</p>
//                 <p className="text-3xl font-bold text-red-600">{stats.criticalCount || 0}</p>
//               </div>
//               <AlertTriangle className="h-12 w-12 text-red-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Value</p>
//                 <p className="text-3xl font-bold text-green-600">${(stats.totalValue || 0).toLocaleString()}</p>
//               </div>
//               <DollarSign className="h-12 w-12 text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Avg Risk</p>
//                 <p className="text-3xl font-bold text-orange-600">{Math.round(stats.avgSpoilageRisk || 0)}%</p>
//               </div>
//               <BarChart3 className="h-12 w-12 text-orange-600" />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 mb-8">
//           <button
//             onClick={runMLPredictions}
//             className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
//           >
//             <Zap className="h-5 w-5" />
//             <span>Run ML Predictions</span>
//           </button>

//           <Link
//             to="/analytics"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//           >
//             <BarChart3 className="h-5 w-5" />
//             <span>View Analytics</span>
//           </Link>

//           <Link
//             to="/donations"
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//           >
//             <Heart className="h-5 w-5" />
//             <span>Manage Donations</span>
//           </Link>
//         </div>

//         {/* Recent Products */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Risk
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Expiry
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                         <div className="text-sm text-gray-500">Batch: {product.batch}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {product.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           product.status === "critical"
//                             ? "bg-red-100 text-red-800"
//                             : product.status === "warning"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {product.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {product.predictions?.spoilageRisk || 0}%
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(product.dates.expiry).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900">
//                         View Details
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard


// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { Package, AlertTriangle, Heart, DollarSign, BarChart3, Zap, Plus, TrendingUp, Users } from "lucide-react"
// import { productsAPI, analyticsAPI, mlAPI } from "../utils/api"
// import { useAuth } from "../hooks/useAuth"

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null)
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [mlLoading, setMlLoading] = useState(false)
//   const { user } = useAuth()

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)

//       // Fetch dashboard analytics
//       const analyticsResponse = await analyticsAPI.getDashboard({ period: "30" })
//       setDashboardData(analyticsResponse.data)

//       // Fetch recent products
//       const productsResponse = await productsAPI.getAll({
//         limit: 10,
//         sortBy: "createdAt",
//         sortOrder: "desc",
//       })
//       setProducts(productsResponse.data.products)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const runMLPredictions = async () => {
//     try {
//       setMlLoading(true)
//       await mlAPI.batchPredict({ limit: 50 })
//       // Refresh data after predictions
//       await fetchDashboardData()
//     } catch (err) {
//       console.error("ML prediction error:", err)
//     } finally {
//       setMlLoading(false)
//     }
//   }

//   const addSampleProduct = async () => {
//     try {
//       const sampleProduct = {
//         name: "Organic Milk 2L",
//         category: "dairy",
//         batch: `MLK-${Date.now()}`,
//         quantity: Math.floor(Math.random() * 50) + 10,
//         unit: "pieces",
//         price: {
//           original: 4.99,
//           current: 4.99,
//           discountPercentage: 0,
//         },
//         dates: {
//           manufactured: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//           expiry: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
//           received: new Date().toISOString(),
//         },
//         storage: {
//           temperature: 4,
//           humidity: 65,
//           location: "Dairy Section A",
//         },
//         supplier: {
//           name: "Fresh Farms Co.",
//           contact: "+1-555-0123",
//           address: "123 Farm Road, Green Valley",
//         },
//       }

//       await productsAPI.create(sampleProduct)
//       await fetchDashboardData()
//     } catch (err) {
//       console.error("Error adding sample product:", err)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const stats = dashboardData?.overview || {}

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
//               <p className="text-gray-600 mt-2">Here's what's happening with your inventory today.</p>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={addSampleProduct}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Add Sample Product</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
//                 <p className="text-sm text-green-600 flex items-center mt-1">
//                   <TrendingUp className="h-4 w-4 mr-1" />
//                   +12% from last month
//                 </p>
//               </div>
//               <Package className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Critical Items</p>
//                 <p className="text-3xl font-bold text-red-600">{stats.criticalCount || 0}</p>
//                 <p className="text-sm text-red-600 flex items-center mt-1">
//                   <AlertTriangle className="h-4 w-4 mr-1" />
//                   Needs attention
//                 </p>
//               </div>
//               <AlertTriangle className="h-12 w-12 text-red-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Value</p>
//                 <p className="text-3xl font-bold text-green-600">${(stats.totalValue || 0).toLocaleString()}</p>
//                 <p className="text-sm text-green-600 flex items-center mt-1">
//                   <TrendingUp className="h-4 w-4 mr-1" />
//                   +8% from last month
//                 </p>
//               </div>
//               <DollarSign className="h-12 w-12 text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Avg Risk</p>
//                 <p className="text-3xl font-bold text-orange-600">{Math.round(stats.avgSpoilageRisk || 0)}%</p>
//                 <p className="text-sm text-orange-600 flex items-center mt-1">
//                   <BarChart3 className="h-4 w-4 mr-1" />
//                   ML Prediction
//                 </p>
//               </div>
//               <BarChart3 className="h-12 w-12 text-orange-600" />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 mb-8">
//           <button
//             onClick={runMLPredictions}
//             disabled={mlLoading}
//             className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
//           >
//             <Zap className="h-5 w-5" />
//             <span>{mlLoading ? "Running Predictions..." : "Run ML Predictions"}</span>
//           </button>

//           <Link
//             to="/analytics"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//           >
//             <BarChart3 className="h-5 w-5" />
//             <span>View Analytics</span>
//           </Link>

//           <Link
//             to="/donations"
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//           >
//             <Heart className="h-5 w-5" />
//             <span>Manage Donations</span>
//           </Link>

//           <Link
//             to="/alerts"
//             className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
//           >
//             <AlertTriangle className="h-5 w-5" />
//             <span>View Alerts ({stats.activeAlerts || 0})</span>
//           </Link>
//         </div>

//         {/* Recent Products */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
//               <Link to="/products" className="text-green-600 hover:text-green-700 font-medium">
//                 View All
//               </Link>
//             </div>
//           </div>

//           {products.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Product
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Risk
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Expiry
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {products.map((product) => (
//                     <tr key={product._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                           <div className="text-sm text-gray-500">Batch: {product.batch}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
//                           {product.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
//                             product.status === "critical"
//                               ? "bg-red-100 text-red-800"
//                               : product.status === "warning"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {product.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <span className="text-sm text-gray-900">{product.predictions?.spoilageRisk || 0}%</span>
//                           <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
//                             <div
//                               className={`h-2 rounded-full ${
//                                 (product.predictions?.spoilageRisk || 0) > 70
//                                   ? "bg-red-500"
//                                   : (product.predictions?.spoilageRisk || 0) > 40
//                                     ? "bg-yellow-500"
//                                     : "bg-green-500"
//                               }`}
//                               style={{ width: `${product.predictions?.spoilageRisk || 0}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {new Date(product.dates.expiry).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900 mr-4">
//                           View
//                         </Link>
//                         {product.predictions?.spoilageRisk > 50 && (
//                           <button className="text-orange-600 hover:text-orange-900">Discount</button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-12 text-center">
//               <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
//               <p className="text-gray-600 mb-4">Get started by adding your first product to the inventory.</p>
//               <button
//                 onClick={addSampleProduct}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//               >
//                 Add Sample Product
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//           <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100">Waste Reduced</p>
//                 <p className="text-2xl font-bold">2.4 tons</p>
//                 <p className="text-green-100 text-sm">This month</p>
//               </div>
//               <Heart className="h-8 w-8 text-green-200" />
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100">Donations Made</p>
//                 <p className="text-2xl font-bold">156</p>
//                 <p className="text-blue-100 text-sm">This month</p>
//               </div>
//               <Users className="h-8 w-8 text-blue-200" />
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100">Cost Savings</p>
//                 <p className="text-2xl font-bold">$18,500</p>
//                 <p className="text-purple-100 text-sm">This month</p>
//               </div>
//               <DollarSign className="h-8 w-8 text-purple-200" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, AlertTriangle, Heart, DollarSign, BarChart3, Zap, Plus, TrendingUp, Users } from "lucide-react"
import { productsAPI, analyticsAPI, mlAPI } from "../utils/api"
import { useAuth } from "../hooks/useAuth"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mlLoading, setMlLoading] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch dashboard analytics
      const analyticsResponse = await analyticsAPI.getDashboard({ period: "30" })
      setDashboardData(analyticsResponse.data)

      // Fetch recent products
      const productsResponse = await productsAPI.getAll({
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
      setProducts(productsResponse.data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runMLPredictions = async () => {
    try {
      setMlLoading(true)
      await mlAPI.batchPredict({ limit: 50 })
      // Refresh data after predictions
      await fetchDashboardData()
    } catch (err) {
      console.error("ML prediction error:", err)
    } finally {
      setMlLoading(false)
    }
  }

  const addSampleProduct = async () => {
    try {
      setAddingProduct(true)

      const categories = ["Dairy", "Bakery", "Produce", "Meat", "Frozen"]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]

      const sampleProducts = {
        Dairy: ["Organic Milk 2L", "Greek Yogurt", "Cheddar Cheese", "Butter"],
        Bakery: ["Whole Wheat Bread", "Croissants", "Bagels", "Muffins"],
        Produce: ["Fresh Apples", "Bananas", "Lettuce", "Tomatoes"],
        Meat: ["Chicken Breast", "Ground Beef", "Salmon Fillet", "Turkey"],
        Frozen: ["Frozen Peas", "Ice Cream", "Frozen Pizza", "Frozen Berries"],
      }

      const productNames = sampleProducts[randomCategory]
      const randomProduct = productNames[Math.floor(Math.random() * productNames.length)]

      const sampleProduct = {
        name: randomProduct,
        category: randomCategory.toLowerCase(),
        batch: `${randomCategory.substring(0, 3).toUpperCase()}-${Date.now()}`,
        quantity: Math.floor(Math.random() * 50) + 10,
        unit: "pieces",
        price: {
          original: Math.floor(Math.random() * 10) + 2.99,
          current: Math.floor(Math.random() * 10) + 2.99,
          discountPercentage: 0,
        },
        dates: {
          manufactured: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString(),
          expiry: new Date(Date.now() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000).toISOString(),
          received: new Date().toISOString(),
        },
        storage: {
          temperature: randomCategory === "Frozen" ? -18 : randomCategory === "Dairy" ? 4 : 20,
          humidity: Math.floor(Math.random() * 20) + 60,
          location: `${randomCategory} Section A`,
        },
        supplier: {
          name: `${randomCategory} Suppliers Co.`,
          contact: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          address: "123 Supply Street, Fresh City",
        },
      }

      const response = await productsAPI.create(sampleProduct)
      console.log("Sample product created:", response)

      // Refresh dashboard data
      await fetchDashboardData()

      alert(`✅ Sample product "${randomProduct}" added successfully!`)
    } catch (err) {
      console.error("Error adding sample product:", err)
      alert(`❌ Failed to add sample product: ${err.message}`)
    } finally {
      setAddingProduct(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            onClick={fetchDashboardData}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.overview || {}

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || "User"}!</h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your inventory today.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addSampleProduct}
                disabled={addingProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                <span>{addingProduct ? "Adding..." : "Add Sample Product"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Items</p>
                <p className="text-3xl font-bold text-red-600">{stats.criticalCount || 0}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Needs attention
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-green-600">${(stats.totalValue || 0).toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last month
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Risk</p>
                <p className="text-3xl font-bold text-orange-600">{Math.round(stats.avgSpoilageRisk || 0)}%</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  ML Prediction
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={runMLPredictions}
            disabled={mlLoading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Zap className="h-5 w-5" />
            <span>{mlLoading ? "Running Predictions..." : "Run ML Predictions"}</span>
          </button>

          <Link
            to="/analytics"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <BarChart3 className="h-5 w-5" />
            <span>View Analytics</span>
          </Link>

          <Link
            to="/donations"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Heart className="h-5 w-5" />
            <span>Manage Donations</span>
          </Link>

          <Link
            to="/alerts"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>View Alerts ({stats.activeAlerts || 0})</span>
          </Link>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
              <Link to="/products" className="text-green-600 hover:text-green-700 font-medium">
                View All
              </Link>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">Batch: {product.batch}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            product.status === "critical"
                              ? "bg-red-100 text-red-800"
                              : product.status === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{product.predictions?.spoilageRisk || 0}%</span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (product.predictions?.spoilageRisk || 0) > 70
                                  ? "bg-red-500"
                                  : (product.predictions?.spoilageRisk || 0) > 40
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${product.predictions?.spoilageRisk || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(product.dates.expiry).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900 mr-4">
                          View
                        </Link>
                        {product.predictions?.spoilageRisk > 50 && (
                          <button className="text-orange-600 hover:text-orange-900">Discount</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product to the inventory.</p>
              <button
                onClick={addSampleProduct}
                disabled={addingProduct}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {addingProduct ? "Adding..." : "Add Sample Product"}
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Waste Reduced</p>
                <p className="text-2xl font-bold">2.4 tons</p>
                <p className="text-green-100 text-sm">This month</p>
              </div>
              <Heart className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Donations Made</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-blue-100 text-sm">This month</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Cost Savings</p>
                <p className="text-2xl font-bold">$18,500</p>
                <p className="text-purple-100 text-sm">This month</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
