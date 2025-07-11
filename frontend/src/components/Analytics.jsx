"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, DollarSign, Package, Heart, Leaf, Award, Target, BarChart3, Activity, Zap } from "lucide-react"
import { analyticsAPI } from "../utils/api"

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [wasteReduction, setWasteReduction] = useState(null)
  const [freshTrackInsights, setFreshTrackInsights] = useState(null)
  const [timeRange, setTimeRange] = useState("30")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Fetch all analytics data
      const [dashboardRes, predictionsRes, wasteRes, insightsRes] = await Promise.all([
        analyticsAPI.getDashboard({ period: timeRange }),
        analyticsAPI.getPredictions({ period: "7" }),
        analyticsAPI.getWasteReduction({ period: timeRange }),
        analyticsAPI.getFreshTrackInsights(),
      ])

      setAnalyticsData(dashboardRes.data)
      setPredictions(predictionsRes.data.predictions || [])
      setWasteReduction(wasteRes.data)
      setFreshTrackInsights(insightsRes.data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  // Prepare chart data
  const categoryData =
    analyticsData?.breakdown?.categories?.map((cat) => ({
      name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
      value: cat.count,
      avgRisk: cat.avgRisk,
      critical: cat.criticalCount,
    })) || []

  const wasteData =
    wasteReduction?.waste?.map((item) => ({
      name: item._id.replace("_", " ").toUpperCase(),
      count: item.count,
      value: item.value,
      co2Impact: item.co2Impact,
    })) || []

  const predictionTrend = predictions.map((pred, index) => ({
    name: pred._id,
    risk: pred.avgRisk,
    count: pred.count,
    value: pred.totalValue,
  }))

  // ESG Impact calculations
  const esgMetrics = {
    co2Saved: wasteReduction?.environmentalImpact?.co2Saved || 0,
    waterSaved: wasteReduction?.environmentalImpact?.waterSaved || 0,
    wasteReduced: wasteReduction?.environmentalImpact?.wasteReduced || 0,
    mealsProvided: wasteReduction?.donations?.estimatedMeals || 0,
    costSavings: analyticsData?.overview?.potentialSavings || 0,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">FreshTrack Analytics</h1>
            <p className="text-gray-600 mt-2">AI-powered insights for sustainable inventory management</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "predictions", label: "ML Predictions", icon: Zap },
            { id: "sustainability", label: "ESG Impact", icon: Leaf },
            { id: "performance", label: "Performance", icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData?.overview?.totalProducts || 0}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% vs last period
                  </p>
                </div>
                <Package className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waste Reduction</p>
                  <p className="text-3xl font-bold text-green-600">
                    {analyticsData?.overview?.wasteReductionPercentage || 0}%
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% improvement
                  </p>
                </div>
                <Leaf className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${(esgMetrics.costSavings || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    This period
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Donations Made</p>
                  <p className="text-3xl font-bold text-orange-600">{analyticsData?.overview?.totalDonations || 0}</p>
                  <p className="text-sm text-orange-600 flex items-center mt-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Community impact
                  </p>
                </div>
                <Heart className="h-12 w-12 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10B981" name="Total Items" />
                  <Bar dataKey="critical" fill="#EF4444" name="Critical Items" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Waste Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {wasteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ML Predictions Tab */}
      {activeTab === "predictions" && (
        <div className="space-y-8">
          {/* ML Model Info */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">FreshTrack ML Engine</h3>
                <p className="text-purple-100">
                  Model Accuracy: {freshTrackInsights?.modelInfo?.accuracy * 100 || 99.8}% | Last Updated:{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <Zap className="h-12 w-12 text-purple-200" />
            </div>
          </div>

          {/* Prediction Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spoilage Risk Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} name="Avg Risk %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Sensitivity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Sensitivity</h3>
              <div className="space-y-4">
                {Object.entries(freshTrackInsights?.modelInfo?.category_sensitivity || {}).map(
                  ([category, sensitivity]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-red-500 h-2 rounded-full"
                            style={{ width: `${(sensitivity / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{sensitivity}/4</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Prediction Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictions.map((pred, index) => (
              <div key={pred._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 capitalize">{pred._id} Risk</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pred._id === "critical"
                        ? "bg-red-100 text-red-800"
                        : pred._id === "high"
                          ? "bg-orange-100 text-orange-800"
                          : pred._id === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pred.count} items
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Avg Risk:</span>
                    <span className="font-medium">{pred.avgRisk}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-medium">${pred.totalValue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{pred.categories?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ESG Impact Tab */}
      {activeTab === "sustainability" && (
        <div className="space-y-8">
          {/* ESG Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Environmental & Social Impact</h3>
                <p className="text-green-100">Driving sustainability through intelligent waste reduction</p>
              </div>
              <Leaf className="h-12 w-12 text-green-200" />
            </div>
          </div>

          {/* ESG Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
                  <p className="text-2xl font-bold text-green-600">{esgMetrics.co2Saved} kg</p>
                  <p className="text-xs text-gray-500">Carbon footprint reduction</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Water Saved</p>
                  <p className="text-2xl font-bold text-blue-600">{esgMetrics.waterSaved?.toLocaleString()} L</p>
                  <p className="text-xs text-gray-500">Water conservation</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Meals Provided</p>
                  <p className="text-2xl font-bold text-orange-600">{esgMetrics.mealsProvided?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Community support</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waste Reduced</p>
                  <p className="text-2xl font-bold text-purple-600">{esgMetrics.wasteReduced} tons</p>
                  <p className="text-xs text-gray-500">Landfill diversion</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Impact Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="co2Impact"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sustainability Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2024 Sustainability Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Waste Reduction</span>
                    <span>75% / 90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "83%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Donation Target</span>
                    <span>1,200 / 1,500 meals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carbon Reduction</span>
                    <span>2.1 / 3.0 tons CO₂</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG Reporting</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Environmental Score</p>
                    <p className="text-sm text-green-700">Above industry average</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">A+</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Social Impact</p>
                    <p className="text-sm text-blue-700">Community partnerships</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">A</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-900">Governance</p>
                    <p className="text-sm text-purple-700">Transparent reporting</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">A+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === "performance" && (
        <div className="space-y-8">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                  <p className="text-3xl font-bold text-green-600">99.8%</p>
                  <p className="text-sm text-green-600">Prediction accuracy</p>
                </div>
                <Target className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-3xl font-bold text-blue-600">1.2s</p>
                  <p className="text-sm text-blue-600">Avg prediction time</p>
                </div>
                <Activity className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {freshTrackInsights?.systemStatus?.totalRecords || 0}
                  </p>
                  <p className="text-sm text-purple-600">Training dataset</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Data Processing Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Inventory Processing</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ML Model Training</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">NLP Analysis</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Running</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
                <div className="space-y-3">
                  {freshTrackInsights?.freshTrackFiles?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{file}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Connected</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
