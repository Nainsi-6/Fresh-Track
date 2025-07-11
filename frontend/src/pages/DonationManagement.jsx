// "use client"

// import { useState } from "react"
// import { MapPin, Phone, Clock, CheckCircle, Calendar } from "lucide-react"

// const DonationManagement = () => {
//   const [activeTab, setActiveTab] = useState("available")

//   const availableItems = [
//     {
//       id: 1,
//       name: "Organic Milk - 2L",
//       quantity: 24,
//       expiryDate: "2024-01-15",
//       category: "Dairy",
//       value: 119.76,
//     },
//     {
//       id: 2,
//       name: "Fresh Bread Loaves",
//       quantity: 18,
//       expiryDate: "2024-01-16",
//       category: "Bakery",
//       value: 44.82,
//     },
//     {
//       id: 3,
//       name: "Bananas - Premium",
//       quantity: 45,
//       expiryDate: "2024-01-18",
//       category: "Produce",
//       value: 89.55,
//     },
//   ]

//   const ngoPartners = [
//     {
//       id: 1,
//       name: "City Food Bank",
//       distance: "2.3 km",
//       phone: "+1 (555) 123-4567",
//       capacity: "High",
//       rating: 4.8,
//       specialties: ["Dairy", "Produce"],
//       lastPickup: "2024-01-10",
//     },
//     {
//       id: 2,
//       name: "Community Kitchen",
//       distance: "3.7 km",
//       phone: "+1 (555) 234-5678",
//       capacity: "Medium",
//       rating: 4.6,
//       specialties: ["Bakery", "Canned Goods"],
//       lastPickup: "2024-01-08",
//     },
//     {
//       id: 3,
//       name: "Homeless Shelter Alliance",
//       distance: "5.1 km",
//       phone: "+1 (555) 345-6789",
//       capacity: "High",
//       rating: 4.9,
//       specialties: ["All Categories"],
//       lastPickup: "2024-01-12",
//     },
//   ]

//   const scheduledPickups = [
//     {
//       id: 1,
//       ngo: "City Food Bank",
//       items: ["Organic Milk - 2L (24 units)", "Fresh Bread (18 units)"],
//       scheduledTime: "2024-01-15 10:00 AM",
//       status: "confirmed",
//       contact: "Sarah Johnson",
//     },
//     {
//       id: 2,
//       ngo: "Community Kitchen",
//       items: ["Bananas - Premium (45 units)"],
//       scheduledTime: "2024-01-15 2:00 PM",
//       status: "pending",
//       contact: "Mike Chen",
//     },
//   ]

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "text-green-600 bg-green-100"
//       case "pending":
//         return "text-yellow-600 bg-yellow-100"
//       case "completed":
//         return "text-blue-600 bg-blue-100"
//       default:
//         return "text-gray-600 bg-gray-100"
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
//         <p className="text-gray-600">Connect surplus food with local NGOs and food banks</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Items Available</p>
//               <p className="text-2xl font-bold text-green-600">87</p>
//             </div>
//             <CheckCircle className="h-8 w-8 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Value</p>
//               <p className="text-2xl font-bold text-blue-600">$2,543</p>
//             </div>
//             <div className="text-2xl">💰</div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">NGO Partners</p>
//               <p className="text-2xl font-bold text-purple-600">12</p>
//             </div>
//             <div className="text-2xl">🤝</div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">This Month</p>
//               <p className="text-2xl font-bold text-orange-600">156</p>
//               <p className="text-xs text-gray-500">donations</p>
//             </div>
//             <div className="text-2xl">📦</div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white rounded-lg shadow-md mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="flex space-x-8 px-6">
//             {[
//               { id: "available", label: "Available Items", count: 3 },
//               { id: "partners", label: "NGO Partners", count: 12 },
//               { id: "scheduled", label: "Scheduled Pickups", count: 2 },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? "border-green-500 text-green-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.label} ({tab.count})
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="p-6">
//           {/* Available Items Tab */}
//           {activeTab === "available" && (
//             <div className="space-y-4">
//               {availableItems.map((item) => (
//                 <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                       <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
//                         <span>Quantity: {item.quantity} units</span>
//                         <span>Expires: {item.expiryDate}</span>
//                         <span>Category: {item.category}</span>
//                         <span className="text-green-600 font-medium">Value: ${item.value}</span>
//                       </div>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//                         Match NGO
//                       </button>
//                       <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
//                         Details
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* NGO Partners Tab */}
//           {activeTab === "partners" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {ngoPartners.map((ngo) => (
//                 <div key={ngo.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                   <div className="flex items-start justify-between mb-4">
//                     <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
//                     <div className="flex items-center">
//                       <span className="text-yellow-400">★</span>
//                       <span className="text-sm text-gray-600 ml-1">{ngo.rating}</span>
//                     </div>
//                   </div>

//                   <div className="space-y-2 text-sm text-gray-600 mb-4">
//                     <div className="flex items-center">
//                       <MapPin className="h-4 w-4 mr-2" />
//                       <span>{ngo.distance} away</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Phone className="h-4 w-4 mr-2" />
//                       <span>{ngo.phone}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 mr-2" />
//                       <span>Last pickup: {ngo.lastPickup}</span>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <p className="text-sm text-gray-600 mb-2">Specialties:</p>
//                     <div className="flex flex-wrap gap-1">
//                       {ngo.specialties.map((specialty, index) => (
//                         <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                           {specialty}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex space-x-2">
//                     <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm">
//                       Schedule Pickup
//                     </button>
//                     <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm">
//                       Contact
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Scheduled Pickups Tab */}
//           {activeTab === "scheduled" && (
//             <div className="space-y-4">
//               {scheduledPickups.map((pickup) => (
//                 <div key={pickup.id} className="border border-gray-200 rounded-lg p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{pickup.ngo}</h3>
//                       <p className="text-sm text-gray-600">Contact: {pickup.contact}</p>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
//                       {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
//                     </span>
//                   </div>

//                   <div className="mb-4">
//                     <p className="text-sm text-gray-600 mb-2">Items:</p>
//                     <ul className="list-disc list-inside text-sm text-gray-700">
//                       {pickup.items.map((item, index) => (
//                         <li key={index}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       <span>{pickup.scheduledTime}</span>
//                     </div>
//                     <div className="flex space-x-2">
//                       {pickup.status === "pending" && (
//                         <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
//                           Confirm
//                         </button>
//                       )}
//                       <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
//                         Reschedule
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DonationManagement

// "use client"

// import { useState, useEffect } from "react"
// import { MapPin, Phone, Clock, CheckCircle, Calendar, Heart, AlertTriangle, Package } from "lucide-react"
// import { donationsAPI } from "../utils/api"

// const DonationManagement = () => {
//   const [activeTab, setActiveTab] = useState("available")
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [donations, setDonations] = useState([])
//   const [availableItems, setAvailableItems] = useState([])
//   const [ngoPartners, setNgoPartners] = useState([])
//   const [scheduledPickups, setScheduledPickups] = useState([])
//   const [donationStats, setDonationStats] = useState({})

//   useEffect(() => {
//     fetchDonationData()
//   }, [])

//   const fetchDonationData = async () => {
//     try {
//       setLoading(true)

//       const [donationsResponse, opportunitiesResponse, ngosResponse] = await Promise.all([
//         donationsAPI.getAll(),
//         donationsAPI.getOpportunities(),
//         donationsAPI.getNGOs(),
//       ])

//       setDonations(donationsResponse.data.donations || [])
//       setAvailableItems(opportunitiesResponse.data.opportunities || [])
//       setNgoPartners(ngosResponse.data.ngos || [])

//       // Calculate stats
//       const stats = donationsResponse.data.statistics || []
//       const totalValue = availableItems.reduce((sum, item) => sum + item.price.current * item.quantity, 0)
//       const totalMeals = availableItems.reduce((sum, item) => sum + (item.donationInsights?.estimatedMeals || 0), 0)

//       setDonationStats({
//         itemsAvailable: availableItems.length,
//         totalValue: totalValue,
//         ngoPartners: ngoPartners.length,
//         thisMonth: stats.find((s) => s._id === "delivered")?.count || 0,
//         totalMeals: totalMeals,
//       })

//       // Filter scheduled pickups (pending donations)
//       setScheduledPickups(donations.filter((d) => d.status === "pending" || d.status === "confirmed"))
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleQuickDonate = async (productId, quantity) => {
//     try {
//       await donationsAPI.quickDonate(productId, { quantity })
//       await fetchDonationData() // Refresh data
//       alert("Donation created successfully!")
//     } catch (err) {
//       alert(`Failed to create donation: ${err.message}`)
//     }
//   }

//   const handleCreateDonation = async (productId, ngoId, quantity, notes) => {
//     try {
//       await donationsAPI.create({
//         productId,
//         ngoId,
//         quantity,
//         notes,
//       })
//       await fetchDonationData() // Refresh data
//       alert("Donation scheduled successfully!")
//     } catch (err) {
//       alert(`Failed to schedule donation: ${err.message}`)
//     }
//   }

//   const handleUpdateDonationStatus = async (donationId, status) => {
//     try {
//       await donationsAPI.updateStatus(donationId, { status })
//       await fetchDonationData() // Refresh data
//     } catch (err) {
//       alert(`Failed to update status: ${err.message}`)
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "text-green-600 bg-green-100"
//       case "pending":
//         return "text-yellow-600 bg-yellow-100"
//       case "collected":
//         return "text-blue-600 bg-blue-100"
//       case "delivered":
//         return "text-purple-600 bg-purple-100"
//       default:
//         return "text-gray-600 bg-gray-100"
//     }
//   }

//   const getUrgencyColor = (urgency) => {
//     switch (urgency?.toLowerCase()) {
//       case "high":
//         return "text-red-600 bg-red-100"
//       case "medium":
//         return "text-yellow-600 bg-yellow-100"
//       case "low":
//         return "text-green-600 bg-green-100"
//       default:
//         return "text-gray-600 bg-gray-100"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading donation data...</p>
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
//             onClick={fetchDonationData}
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
//         <p className="text-gray-600">Connect surplus food with local NGOs using FreshTrack optimization</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Items Available</p>
//               <p className="text-2xl font-bold text-green-600">{donationStats.itemsAvailable || 0}</p>
//             </div>
//             <CheckCircle className="h-8 w-8 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Value</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 ${Math.round(donationStats.totalValue || 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-2xl">💰</div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">NGO Partners</p>
//               <p className="text-2xl font-bold text-purple-600">{donationStats.ngoPartners || 0}</p>
//             </div>
//             <div className="text-2xl">🤝</div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Potential Meals</p>
//               <p className="text-2xl font-bold text-orange-600">
//                 {Math.round(donationStats.totalMeals || 0).toLocaleString()}
//               </p>
//               <p className="text-xs text-gray-500">from available items</p>
//             </div>
//             <div className="text-2xl">🍽️</div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white rounded-lg shadow-md mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="flex space-x-8 px-6">
//             {[
//               { id: "available", label: "Available Items", count: availableItems.length },
//               { id: "partners", label: "NGO Partners", count: ngoPartners.length },
//               { id: "scheduled", label: "Scheduled Pickups", count: scheduledPickups.length },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? "border-green-500 text-green-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.label} ({tab.count})
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="p-6">
//           {/* Available Items Tab */}
//           {activeTab === "available" && (
//             <div className="space-y-4">
//               {availableItems.length > 0 ? (
//                 availableItems.map((item) => (
//                   <div
//                     key={item._id}
//                     className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.donationInsights?.urgency)}`}
//                           >
//                             {item.donationInsights?.urgency || "Medium"} Priority
//                           </span>
//                           <span className="text-sm text-gray-500">
//                             Risk: {Math.round(item.predictions?.spoilageRisk || 0)}%
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
//                           <span>Quantity: {item.quantity} units</span>
//                           <span>Expires: {new Date(item.dates.expiry).toLocaleDateString()}</span>
//                           <span>Category: {item.category}</span>
//                           <span className="text-green-600 font-medium">
//                             Value: ${(item.price.current * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                         {item.donationInsights && (
//                           <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
//                             <span>🍽️ {item.donationInsights.estimatedMeals} meals</span>
//                             <span>💰 ${item.donationInsights.taxBenefit} tax benefit</span>
//                             <span>🌱 {item.donationInsights.environmentalImpact?.co2Saved}</span>
//                             <span>⏰ {item.donationInsights.optimalPickupWindow}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex space-x-2 ml-4">
//                         <button
//                           onClick={() => handleQuickDonate(item._id, Math.ceil(item.quantity * 0.8))}
//                           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1"
//                         >
//                           <Heart className="h-4 w-4" />
//                           <span>Quick Donate</span>
//                         </button>
//                         <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
//                           Details
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No donation opportunities</h3>
//                   <p className="text-gray-600">
//                     Products will appear here when they reach optimal donation window (50-90% spoilage risk)
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* NGO Partners Tab */}
//           {activeTab === "partners" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {ngoPartners.map((ngo) => (
//                 <div key={ngo._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                   <div className="flex items-start justify-between mb-4">
//                     <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
//                     <div className="flex items-center">
//                       <span className="text-yellow-400">★</span>
//                       <span className="text-sm text-gray-600 ml-1">{ngo.rating?.average || 4.5}</span>
//                       {ngo.freshTrackScore && (
//                         <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                           FT: {ngo.freshTrackScore}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="space-y-2 text-sm text-gray-600 mb-4">
//                     <div className="flex items-center">
//                       <MapPin className="h-4 w-4 mr-2" />
//                       <span>{ngo.distance || "2.5 km"} away</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Phone className="h-4 w-4 mr-2" />
//                       <span>{ngo.phone}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 mr-2" />
//                       <span>
//                         Last pickup:{" "}
//                         {ngo.lastDonationDate ? new Date(ngo.lastDonationDate).toLocaleDateString() : "Never"}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-xs">Capacity: {ngo.capacity || "Medium"}</span>
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <p className="text-sm text-gray-600 mb-2">Specialties:</p>
//                     <div className="flex flex-wrap gap-1">
//                       {(ngo.acceptedCategories || []).map((specialty, index) => (
//                         <span
//                           key={index}
//                           className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize"
//                         >
//                           {specialty}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm">
//                       Schedule Pickup
//                     </button>
//                     <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm">
//                       Contact
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Scheduled Pickups Tab */}
//           {activeTab === "scheduled" && (
//             <div className="space-y-4">
//               {scheduledPickups.length > 0 ? (
//                 scheduledPickups.map((pickup) => (
//                   <div key={pickup._id} className="border border-gray-200 rounded-lg p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{pickup.ngoId?.name || "Unknown NGO"}</h3>
//                         <p className="text-sm text-gray-600">Contact: {pickup.ngoId?.phone || "No contact"}</p>
//                         <p className="text-sm text-gray-600">Product: {pickup.productId?.name || "Unknown Product"}</p>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
//                         {pickup.status?.charAt(0).toUpperCase() + pickup.status?.slice(1) || "Pending"}
//                       </span>
//                     </div>
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-600 mb-2">Donation Details:</p>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                         <span>Quantity: {pickup.quantity} units</span>
//                         <span>Value: ${pickup.value?.toFixed(2) || "0.00"}</span>
//                         {pickup.freshTrackData?.estimatedMeals && (
//                           <span>Meals: {pickup.freshTrackData.estimatedMeals}</span>
//                         )}
//                         {pickup.freshTrackData?.environmentalImpact?.co2Saved && (
//                           <span>CO₂ Saved: {pickup.freshTrackData.environmentalImpact.co2Saved}</span>
//                         )}
//                       </div>
//                       {pickup.notes && <p className="text-sm text-gray-600 mt-2">Notes: {pickup.notes}</p>}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Calendar className="h-4 w-4 mr-2" />
//                         <span>Created: {new Date(pickup.createdAt).toLocaleDateString()}</span>
//                       </div>
//                       <div className="flex space-x-2">
//                         {pickup.status === "pending" && (
//                           <button
//                             onClick={() => handleUpdateDonationStatus(pickup._id, "confirmed")}
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
//                           >
//                             Confirm
//                           </button>
//                         )}
//                         {pickup.status === "confirmed" && (
//                           <button
//                             onClick={() => handleUpdateDonationStatus(pickup._id, "collected")}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
//                           >
//                             Mark Collected
//                           </button>
//                         )}
//                         <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
//                           Reschedule
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled pickups</h3>
//                   <p className="text-gray-600">Donations will appear here once scheduled with NGO partners</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DonationManagement



"use client"
import { useState, useEffect } from "react"
import {
  Package,
  Heart,
  DollarSign,
  Users,
  MapPin,
  Phone,
  Clock,
  Star,
  Calendar,
  AlertTriangle,
  Search,
} from "lucide-react"
import { donationsAPI } from "../utils/api"

const DonationManagement = () => {
  const [activeTab, setActiveTab] = useState("available")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Data states
  const [stats, setStats] = useState({
    itemsAvailable: 0,
    totalValue: 0,
    ngoPartners: 0,
    potentialMeals: 0,
  })
  const [availableItems, setAvailableItems] = useState([])
  const [ngoPartners, setNgoPartners] = useState([])
  const [scheduledPickups, setScheduledPickups] = useState([])
  const [donations, setDonations] = useState([])

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)

      // Fetch donation opportunities (available items)
      const opportunitiesResponse = await donationsAPI.getOpportunities()
      const opportunities = opportunitiesResponse.data.opportunities || []
      setAvailableItems(opportunities)

      // Fetch NGO partners
      const ngosResponse = await donationsAPI.getNGOs()
      const ngos = ngosResponse.data.ngos || []
      setNgoPartners(ngos)

      // Fetch existing donations
      const donationsResponse = await donationsAPI.getAll()
      const allDonations = donationsResponse.data.donations || []
      setDonations(allDonations)

      // Filter scheduled pickups
      const scheduled = allDonations.filter((d) => d.status === "scheduled" || d.status === "confirmed")
      setScheduledPickups(scheduled)

      // Calculate stats
      const totalValue = opportunities.reduce((sum, item) => sum + item.price.current * item.quantity, 0)
      const potentialMeals = opportunities.reduce((sum, item) => sum + (item.donationInsights?.estimatedMeals || 0), 0)

      setStats({
        itemsAvailable: opportunities.length,
        totalValue: Math.round(totalValue),
        ngoPartners: ngos.length,
        potentialMeals: Math.round(potentialMeals),
      })
    } catch (err) {
      setError(err.message)
      console.error("Error fetching donation data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDonate = async (productId) => {
    try {
      const response = await donationsAPI.quickDonate(productId, { quantity: 10 })
      alert(`✅ Quick donation created successfully!`)
      await fetchAllData() // Refresh data
    } catch (err) {
      alert(`❌ Failed to create donation: ${err.message}`)
    }
  }

  const handleSchedulePickup = async (ngoId, productId = null) => {
    try {
      // Create donation first
      const donationData = {
        productId: productId || availableItems[0]?._id,
        ngoId: ngoId,
        quantity: 15,
        notes: "Scheduled via NGO partner card",
      }

      const donationResponse = await donationsAPI.create(donationData)

      // Schedule pickup
      const pickupData = {
        pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: "Pickup scheduled from donation management",
      }

      await donationsAPI.schedulePickup(donationResponse.data.donation._id, pickupData)

      alert(`✅ Pickup scheduled successfully!`)
      await fetchAllData() // Refresh data
    } catch (err) {
      alert(`❌ Failed to schedule pickup: ${err.message}`)
    }
  }

  const handleContactNGO = (ngo) => {
    if (ngo.phone) {
      window.open(`tel:${ngo.phone}`)
    } else {
      alert(`Contact ${ngo.name} at their registered phone number`)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "collected":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAvailableItems = availableItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter
    const matchesUrgency = urgencyFilter === "all" || item.donationInsights?.urgency === urgencyFilter

    return matchesSearch && matchesCategory && matchesUrgency
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donation data...</p>
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
          <button onClick={fetchAllData} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
        <p className="text-gray-600">Connect surplus food with local NGOs using FreshTrack optimization</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Items Available</p>
              <p className="text-3xl font-bold text-green-600">{stats.itemsAvailable}</p>
            </div>
            <Package className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-blue-600">${stats.totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">NGO Partners</p>
              <p className="text-3xl font-bold text-purple-600">{stats.ngoPartners}</p>
            </div>
            <Users className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Potential Meals</p>
              <p className="text-3xl font-bold text-orange-600">{stats.potentialMeals}</p>
              <p className="text-xs text-gray-500">from available items</p>
            </div>
            <Heart className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "available", label: `Available Items (${stats.itemsAvailable})`, count: stats.itemsAvailable },
              { id: "partners", label: `NGO Partners (${stats.ngoPartners})`, count: stats.ngoPartners },
              {
                id: "scheduled",
                label: `Scheduled Pickups (${scheduledPickups.length})`,
                count: scheduledPickups.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Available Items Tab */}
          {activeTab === "available" && (
            <div>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                    />
                  </div>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="dairy">Dairy</option>
                  <option value="produce">Produce</option>
                  <option value="bakery">Bakery</option>
                  <option value="meat">Meat</option>
                </select>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Urgency</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Available Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableItems.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.donationInsights?.urgency)}`}
                      >
                        {item.donationInsights?.urgency || "medium"} urgency
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{item.quantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span className="font-medium">${(item.price.current * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expiry:</span>
                        <span className="font-medium">{new Date(item.dates.expiry).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Meals:</span>
                        <span className="font-medium">{item.donationInsights?.estimatedMeals || 0}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleQuickDonate(item._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        Quick Donate
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAvailableItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
                  <p className="text-gray-600">No items match your current filters.</p>
                </div>
              )}
            </div>
          )}

          {/* NGO Partners Tab */}
          {activeTab === "partners" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngoPartners.map((ngo) => (
                <div key={ngo._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{ngo.rating?.average || "4.5"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{ngo.distance} away</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{ngo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        Last pickup:{" "}
                        {ngo.lastDonationDate ? new Date(ngo.lastDonationDate).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs">Capacity: {ngo.capacity}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {(ngo.acceptedCategories || []).map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSchedulePickup(ngo._id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Schedule Pickup
                    </button>
                    <button
                      onClick={() => handleContactNGO(ngo)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scheduled Pickups Tab */}
          {activeTab === "scheduled" && (
            <div className="space-y-4">
              {scheduledPickups.map((pickup) => (
                <div
                  key={pickup._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{pickup.productId?.name}</h3>
                      <p className="text-sm text-gray-600">NGO: {pickup.ngoId?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                      {pickup.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-medium">{pickup.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value</p>
                      <p className="font-medium">${pickup.value?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Scheduled</p>
                      <p className="font-medium">{new Date(pickup.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Meals</p>
                      <p className="font-medium">{pickup.freshTrackData?.estimatedMeals || 0}</p>
                    </div>
                  </div>

                  {pickup.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{pickup.notes}</p>
                    </div>
                  )}
                </div>
              ))}

              {scheduledPickups.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled pickups</h3>
                  <p className="text-gray-600">Schedule pickups from the NGO Partners tab.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationManagement
