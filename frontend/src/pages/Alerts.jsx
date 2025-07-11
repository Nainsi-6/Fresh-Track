// "use client"

// import { useState } from "react"
// import { Bell, AlertTriangle, Clock, CheckCircle, X, Filter } from "lucide-react"

// const Alerts = () => {
//   const [filter, setFilter] = useState("all")
//   const [alerts, setAlerts] = useState([
//     {
//       id: 1,
//       type: "critical",
//       title: "Organic Milk expires in 24 hours",
//       message: "Batch MLK-2024-001 (24 units) needs immediate action",
//       timestamp: "2024-01-14 09:30 AM",
//       actions: ["Apply 50% discount", "Donate to City Food Bank"],
//       isRead: false,
//       confidence: 95,
//     },
//     {
//       id: 2,
//       type: "warning",
//       title: "Fresh Bread batch showing early spoilage signs",
//       message: "Customer feedback indicates quality issues with batch BRD-2024-045",
//       timestamp: "2024-01-14 08:15 AM",
//       actions: ["Inspect batch", "Apply discount"],
//       isRead: false,
//       confidence: 78,
//     },
//     {
//       id: 3,
//       type: "info",
//       title: "NGO pickup scheduled",
//       message: "Community Kitchen will collect donated items at 2:00 PM today",
//       timestamp: "2024-01-14 07:45 AM",
//       actions: ["Prepare items", "Contact NGO"],
//       isRead: true,
//       confidence: 100,
//     },
//     {
//       id: 4,
//       type: "success",
//       title: "Successful donation completed",
//       message: "City Food Bank collected 45 units of produce, saving $89.55",
//       timestamp: "2024-01-13 04:30 PM",
//       actions: [],
//       isRead: true,
//       confidence: 100,
//     },
//     {
//       id: 5,
//       type: "critical",
//       title: "Temperature alert in dairy section",
//       message: "Refrigeration unit #3 temperature above optimal range",
//       timestamp: "2024-01-13 02:15 PM",
//       actions: ["Check refrigeration", "Move products"],
//       isRead: false,
//       confidence: 88,
//     },
//   ])

//   const getAlertIcon = (type) => {
//     switch (type) {
//       case "critical":
//         return <AlertTriangle className="h-5 w-5 text-red-500" />
//       case "warning":
//         return <Clock className="h-5 w-5 text-yellow-500" />
//       case "success":
//         return <CheckCircle className="h-5 w-5 text-green-500" />
//       default:
//         return <Bell className="h-5 w-5 text-blue-500" />
//     }
//   }

//   const getAlertColor = (type) => {
//     switch (type) {
//       case "critical":
//         return "border-l-red-500 bg-red-50"
//       case "warning":
//         return "border-l-yellow-500 bg-yellow-50"
//       case "success":
//         return "border-l-green-500 bg-green-50"
//       default:
//         return "border-l-blue-500 bg-blue-50"
//     }
//   }

//   const filteredAlerts = alerts.filter((alert) => {
//     if (filter === "all") return true
//     if (filter === "unread") return !alert.isRead
//     return alert.type === filter
//   })

//   const markAsRead = (id) => {
//     setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
//   }

//   const dismissAlert = (id) => {
//     setAlerts(alerts.filter((alert) => alert.id !== id))
//   }

//   const unreadCount = alerts.filter((alert) => !alert.isRead).length

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Notifications</h1>
//             <p className="text-gray-600">Stay informed about critical inventory events</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
//               {unreadCount} unread
//             </div>
//             <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Mark all as read</button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <div className="flex items-center space-x-4">
//           <Filter className="h-5 w-5 text-gray-400" />
//           <div className="flex space-x-2">
//             {[
//               { id: "all", label: "All", count: alerts.length },
//               { id: "unread", label: "Unread", count: unreadCount },
//               { id: "critical", label: "Critical", count: alerts.filter((a) => a.type === "critical").length },
//               { id: "warning", label: "Warning", count: alerts.filter((a) => a.type === "warning").length },
//             ].map((filterOption) => (
//               <button
//                 key={filterOption.id}
//                 onClick={() => setFilter(filterOption.id)}
//                 className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                   filter === filterOption.id
//                     ? "bg-green-100 text-green-800"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 {filterOption.label} ({filterOption.count})
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Alerts List */}
//       <div className="space-y-4">
//         {filteredAlerts.map((alert) => (
//           <div
//             key={alert.id}
//             className={`bg-white border-l-4 rounded-lg shadow-md p-6 ${getAlertColor(alert.type)} ${
//               !alert.isRead ? "ring-2 ring-blue-100" : ""
//             }`}
//           >
//             <div className="flex items-start justify-between">
//               <div className="flex items-start space-x-4 flex-1">
//                 <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <h3 className={`font-semibold ${!alert.isRead ? "text-gray-900" : "text-gray-700"}`}>
//                       {alert.title}
//                     </h3>
//                     {!alert.isRead && <span className="bg-blue-500 w-2 h-2 rounded-full"></span>}
//                   </div>
//                   <p className="text-gray-600 mb-3">{alert.message}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">{alert.timestamp}</span>
//                     {alert.confidence && <span className="text-sm text-gray-500">Confidence: {alert.confidence}%</span>}
//                   </div>
//                   {alert.actions.length > 0 && (
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       {alert.actions.map((action, index) => (
//                         <button
//                           key={index}
//                           className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-50 transition-colors"
//                         >
//                           {action}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2 ml-4">
//                 {!alert.isRead && (
//                   <button onClick={() => markAsRead(alert.id)} className="text-blue-600 hover:text-blue-700 text-sm">
//                     Mark as read
//                   </button>
//                 )}
//                 <button onClick={() => dismissAlert(alert.id)} className="text-gray-400 hover:text-gray-600">
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredAlerts.length === 0 && (
//         <div className="text-center py-12">
//           <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
//           <p className="text-gray-600">All caught up! No alerts match your current filter.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Alerts


"use client"
import { useState, useEffect } from "react"
import { Bell, AlertTriangle, Clock, CheckCircle, X, Filter, Loader2 } from "lucide-react"
import { alertsAPI } from "../utils/api"

const Alerts = () => {
  const [filter, setFilter] = useState("all")
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [summary, setSummary] = useState({})

  useEffect(() => {
    fetchAlerts()
  }, [filter])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await alertsAPI.getAll({
        limit: 50,
        type: filter === "all" ? undefined : filter,
        status: filter === "unread" ? "unread" : "all",
      })

      setAlerts(response.data.alerts || [])
      setSummary(response.data.summary || {})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case "critical":
        return "border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "success":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const markAsRead = async (id) => {
    try {
      await alertsAPI.acknowledge(id)
      setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }

  const dismissAlert = async (id) => {
    try {
      await alertsAPI.dismiss(id)
      setAlerts(alerts.filter((alert) => alert.id !== id))
    } catch (err) {
      console.error("Failed to dismiss alert:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadAlerts = alerts.filter((alert) => !alert.isRead)
      await Promise.all(unreadAlerts.map((alert) => alertsAPI.acknowledge(alert.id)))
      setAlerts(alerts.map((alert) => ({ ...alert, isRead: true })))
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading alerts...</p>
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
          <button onClick={fetchAlerts} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Notifications</h1>
            <p className="text-gray-600">Stay informed about critical inventory events from FreshTrack data</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {summary.unread || 0} unread
            </div>
            <button onClick={markAllAsRead} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Mark all as read
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { id: "all", label: "All", count: summary.total || 0 },
              { id: "unread", label: "Unread", count: summary.unread || 0 },
              { id: "critical", label: "Critical", count: summary.critical || 0 },
              { id: "warning", label: "Warning", count: summary.warning || 0 },
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white border-l-4 rounded-lg shadow-md p-6 ${getAlertColor(alert.type)} ${
              !alert.isRead ? "ring-2 ring-blue-100" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-semibold ${!alert.isRead ? "text-gray-900" : "text-gray-700"}`}>
                      {alert.title}
                    </h3>
                    {!alert.isRead && <span className="bg-blue-500 w-2 h-2 rounded-full"></span>}
                  </div>
                  <p className="text-gray-600 mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                    {alert.confidence && <span className="text-sm text-gray-500">Confidence: {alert.confidence}%</span>}
                  </div>
                  {alert.actions && alert.actions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {alert.actions.map((action, index) => (
                        <button
                          key={index}
                          className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-50 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                  {alert.metadata && (
                    <div className="mt-2 text-xs text-gray-500">
                      {alert.metadata.spoilageRisk && (
                        <span className="mr-4">Risk: {alert.metadata.spoilageRisk}%</span>
                      )}
                      {alert.metadata.quantity && <span className="mr-4">Qty: {alert.metadata.quantity}</span>}
                      {alert.metadata.category && <span>Category: {alert.metadata.category}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!alert.isRead && (
                  <button onClick={() => markAsRead(alert.id)} className="text-blue-600 hover:text-blue-700 text-sm">
                    Mark as read
                  </button>
                )}
                <button onClick={() => dismissAlert(alert.id)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">All caught up! No alerts match your current filter.</p>
        </div>
      )}
    </div>
  )
}

export default Alerts
