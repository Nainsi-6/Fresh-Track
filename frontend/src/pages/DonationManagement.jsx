"use client"

import { useState } from "react"
import { MapPin, Phone, Clock, CheckCircle, Calendar } from "lucide-react"

const DonationManagement = () => {
  const [activeTab, setActiveTab] = useState("available")

  const availableItems = [
    {
      id: 1,
      name: "Organic Milk - 2L",
      quantity: 24,
      expiryDate: "2024-01-15",
      category: "Dairy",
      value: 119.76,
    },
    {
      id: 2,
      name: "Fresh Bread Loaves",
      quantity: 18,
      expiryDate: "2024-01-16",
      category: "Bakery",
      value: 44.82,
    },
    {
      id: 3,
      name: "Bananas - Premium",
      quantity: 45,
      expiryDate: "2024-01-18",
      category: "Produce",
      value: 89.55,
    },
  ]

  const ngoPartners = [
    {
      id: 1,
      name: "City Food Bank",
      distance: "2.3 km",
      phone: "+1 (555) 123-4567",
      capacity: "High",
      rating: 4.8,
      specialties: ["Dairy", "Produce"],
      lastPickup: "2024-01-10",
    },
    {
      id: 2,
      name: "Community Kitchen",
      distance: "3.7 km",
      phone: "+1 (555) 234-5678",
      capacity: "Medium",
      rating: 4.6,
      specialties: ["Bakery", "Canned Goods"],
      lastPickup: "2024-01-08",
    },
    {
      id: 3,
      name: "Homeless Shelter Alliance",
      distance: "5.1 km",
      phone: "+1 (555) 345-6789",
      capacity: "High",
      rating: 4.9,
      specialties: ["All Categories"],
      lastPickup: "2024-01-12",
    },
  ]

  const scheduledPickups = [
    {
      id: 1,
      ngo: "City Food Bank",
      items: ["Organic Milk - 2L (24 units)", "Fresh Bread (18 units)"],
      scheduledTime: "2024-01-15 10:00 AM",
      status: "confirmed",
      contact: "Sarah Johnson",
    },
    {
      id: 2,
      ngo: "Community Kitchen",
      items: ["Bananas - Premium (45 units)"],
      scheduledTime: "2024-01-15 2:00 PM",
      status: "pending",
      contact: "Mike Chen",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "completed":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
        <p className="text-gray-600">Connect surplus food with local NGOs and food banks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Items Available</p>
              <p className="text-2xl font-bold text-green-600">87</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">$2,543</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">NGO Partners</p>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
            <div className="text-2xl">🤝</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-orange-600">156</p>
              <p className="text-xs text-gray-500">donations</p>
            </div>
            <div className="text-2xl">📦</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "available", label: "Available Items", count: 3 },
              { id: "partners", label: "NGO Partners", count: 12 },
              { id: "scheduled", label: "Scheduled Pickups", count: 2 },
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Available Items Tab */}
          {activeTab === "available" && (
            <div className="space-y-4">
              {availableItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Quantity: {item.quantity} units</span>
                        <span>Expires: {item.expiryDate}</span>
                        <span>Category: {item.category}</span>
                        <span className="text-green-600 font-medium">Value: ${item.value}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Match NGO
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NGO Partners Tab */}
          {activeTab === "partners" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngoPartners.map((ngo) => (
                <div key={ngo.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{ngo.rating}</span>
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
                      <span>Last pickup: {ngo.lastPickup}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {ngo.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm">
                      Schedule Pickup
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm">
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
                <div key={pickup.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{pickup.ngo}</h3>
                      <p className="text-sm text-gray-600">Contact: {pickup.contact}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
                      {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Items:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {pickup.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{pickup.scheduledTime}</span>
                    </div>
                    <div className="flex space-x-2">
                      {pickup.status === "pending" && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                          Confirm
                        </button>
                      )}
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationManagement
