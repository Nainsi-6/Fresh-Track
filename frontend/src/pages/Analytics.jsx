"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Leaf, Users, DollarSign, Award } from "lucide-react"

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month")

  const wasteData = [
    { month: "Jan", waste: 120, donated: 80, saved: 200 },
    { month: "Feb", waste: 100, donated: 95, saved: 195 },
    { month: "Mar", waste: 85, donated: 110, saved: 195 },
    { month: "Apr", waste: 70, donated: 125, saved: 195 },
    { month: "May", waste: 60, donated: 140, saved: 200 },
    { month: "Jun", waste: 45, donated: 155, saved: 200 },
  ]

  const impactMetrics = {
    co2Saved: 2.4, // tons
    waterSaved: 15600, // gallons
    mealsDonated: 1250,
    costSavings: 18500, // dollars
  }

  const leaderboard = [
    { name: "Store #001 - Downtown", score: 95, waste: 12, donations: 45 },
    { name: "Store #003 - Mall Plaza", score: 92, waste: 15, donations: 42 },
    { name: "Store #007 - Riverside", score: 88, waste: 18, donations: 38 },
    { name: "Store #012 - Northside", score: 85, waste: 22, donations: 35 },
    { name: "Store #005 - Central", score: 82, waste: 25, donations: 32 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & ESG Impact</h1>
            <p className="text-gray-600">Track sustainability metrics and environmental impact</p>
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="h-8 w-8" />
            <TrendingDown className="h-5 w-5" />
          </div>
          <p className="text-green-100 text-sm">CO₂ Emissions Saved</p>
          <p className="text-3xl font-bold">{impactMetrics.co2Saved}t</p>
          <p className="text-green-100 text-sm mt-2">↓ 15% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">💧</div>
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-blue-100 text-sm">Water Saved</p>
          <p className="text-3xl font-bold">{impactMetrics.waterSaved.toLocaleString()}</p>
          <p className="text-blue-100 text-sm mt-2">gallons</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-purple-100 text-sm">Community Meals</p>
          <p className="text-3xl font-bold">{impactMetrics.mealsDonated.toLocaleString()}</p>
          <p className="text-purple-100 text-sm mt-2">↑ 23% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-orange-100 text-sm">Cost Savings</p>
          <p className="text-3xl font-bold">${impactMetrics.costSavings.toLocaleString()}</p>
          <p className="text-orange-100 text-sm mt-2">↑ 18% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Waste Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Waste Reduction Trends</h2>
          <div className="h-80">
            <svg className="w-full h-full" viewBox="0 0 500 300">
              <defs>
                <linearGradient id="wasteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="donatedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} x1="50" y1={250 - y} x2="450" y2={250 - y} stroke="#E5E7EB" strokeWidth="1" />
              ))}

              {/* Waste line */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                points={wasteData.map((point, index) => `${50 + index * 66.67},${250 - point.waste}`).join(" ")}
              />

              {/* Donated line */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                points={wasteData.map((point, index) => `${50 + index * 66.67},${250 - point.donated}`).join(" ")}
              />

              {/* Data points */}
              {wasteData.map((point, index) => (
                <g key={index}>
                  <circle cx={50 + index * 66.67} cy={250 - point.waste} r="4" fill="#EF4444" />
                  <circle cx={50 + index * 66.67} cy={250 - point.donated} r="4" fill="#10B981" />
                </g>
              ))}

              {/* X-axis labels */}
              {wasteData.map((point, index) => (
                <text key={index} x={50 + index * 66.67} y="275" textAnchor="middle" className="text-sm fill-gray-600">
                  {point.month}
                </text>
              ))}
            </svg>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Food Waste (kg)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Donated (kg)</span>
            </div>
          </div>
        </div>

        {/* Waste Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Waste by Category</h2>
          <div className="space-y-4">
            {[
              { category: "Dairy", percentage: 35, color: "bg-blue-500" },
              { category: "Produce", percentage: 28, color: "bg-green-500" },
              { category: "Bakery", percentage: 20, color: "bg-yellow-500" },
              { category: "Meat", percentage: 12, color: "bg-red-500" },
              { category: "Other", percentage: 5, color: "bg-gray-500" },
            ].map((item) => (
              <div key={item.category} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">{item.category}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Leaderboard */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Store Performance Leaderboard</h2>
          <Award className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Store</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Waste (kg)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Donations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((store, index) => (
                <tr key={store.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                      {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                      {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                      <span className="font-medium">{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{store.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="font-bold text-green-600">{store.score}</span>
                      <span className="text-gray-500 ml-1">/100</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-red-600 font-medium">{store.waste}</td>
                  <td className="py-4 px-4 text-green-600 font-medium">{store.donations}</td>
                  <td className="py-4 px-4">
                    {store.score >= 90 && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Eco Champion
                      </span>
                    )}
                    {store.score >= 80 && store.score < 90 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Sustainability Star
                      </span>
                    )}
                    {store.score < 80 && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Improving
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
