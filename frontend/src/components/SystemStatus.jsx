"use client"
import { useState, useEffect } from "react"
import { Activity, Wifi, WifiOff } from "lucide-react"

const SystemStatus = () => {
  const [status, setStatus] = useState({
    online: true,
    mlActive: true,
    dataSync: true,
    lastUpdate: new Date(),
  })

  useEffect(() => {
    // Simulate system status checks
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        lastUpdate: new Date(),
        // Simulate occasional offline status
        online: Math.random() > 0.05,
        mlActive: Math.random() > 0.02,
        dataSync: Math.random() > 0.03,
      }))
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (!status.online || !status.dataSync) return "text-red-500"
    if (!status.mlActive) return "text-yellow-500"
    return "text-green-500"
  }

  const getStatusText = () => {
    if (!status.online) return "Offline"
    if (!status.dataSync) return "Sync Error"
    if (!status.mlActive) return "ML Inactive"
    return "All Systems Active"
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full">
      <div className="flex items-center space-x-1">
        {status.online ? (
          <Wifi className={`h-3 w-3 ${getStatusColor()}`} />
        ) : (
          <WifiOff className="h-3 w-3 text-red-500" />
        )}
        <Activity className={`h-3 w-3 ${getStatusColor()}`} />
      </div>
      <span className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
    </div>
  )
}

export default SystemStatus
