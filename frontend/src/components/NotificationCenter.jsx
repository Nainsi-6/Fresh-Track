"use client"

import { useState, useEffect } from "react"
import { Bell, X, AlertTriangle, Clock, CheckCircle, Heart, Zap } from "lucide-react"
import { alertsAPI } from "../utils/api"

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    // Set up real-time polling
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await alertsAPI.getAll({ limit: 50, sortBy: "createdAt", sortOrder: "desc" })
      const alerts = response.data.alerts || []

      // Transform alerts to notifications
      const transformedNotifications = alerts.map((alert) => ({
        id: alert.id,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp,
        isRead: alert.isRead,
        actions: alert.actions || [],
        metadata: alert.metadata,
        priority: alert.type === "critical" ? "high" : alert.type === "warning" ? "medium" : "low",
      }))

      setNotifications(transformedNotifications)
      setUnreadCount(transformedNotifications.filter((n) => !n.isRead).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await alertsAPI.acknowledge(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)
      await Promise.all(unreadIds.map((id) => alertsAPI.acknowledge(id)))
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const dismissNotification = async (id) => {
    try {
      await alertsAPI.dismiss(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      const notification = notifications.find((n) => n.id === id)
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error dismissing notification:", error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "donation":
        return <Heart className="h-5 w-5 text-pink-500" />
      case "prediction":
        return <Zap className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type, priority) => {
    if (priority === "high") return "border-l-red-500 bg-red-50"
    if (priority === "medium") return "border-l-yellow-500 bg-yellow-50"
    return "border-l-blue-500 bg-blue-50"
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.isRead
    return notification.type === filter
  })

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-sm text-green-600 hover:text-green-700">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-2 mt-3">
                {[
                  { id: "all", label: "All" },
                  { id: "unread", label: "Unread" },
                  { id: "critical", label: "Critical" },
                  { id: "warning", label: "Warnings" },
                ].map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      filter === filterOption.id
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              {notification.metadata && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {notification.metadata.spoilageRisk && (
                                    <span className="mr-3">Risk: {notification.metadata.spoilageRisk}%</span>
                                  )}
                                  {notification.metadata.quantity && (
                                    <span className="mr-3">Qty: {notification.metadata.quantity}</span>
                                  )}
                                  {notification.metadata.category && (
                                    <span>Category: {notification.metadata.category}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  dismissNotification(notification.id)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{getTimeAgo(notification.timestamp)}</span>
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex space-x-2">
                                {notification.actions.slice(0, 2).map((action, index) => (
                                  <button
                                    key={index}
                                    className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to full notifications page
                }}
                className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View All Notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

export default NotificationCenter
