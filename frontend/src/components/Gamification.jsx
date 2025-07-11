"use client"

import { useState } from "react"
import { Trophy, Star, TrendingUp, Users, Award, Zap, Heart, Leaf, Crown, Medal, Gift } from "lucide-react"

const Gamification = () => {
  const [userStats, setUserStats] = useState({
    points: 2450,
    level: 7,
    rank: 3,
    badges: 12,
    streak: 15,
  })

  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "Sarah Johnson", points: 3200, level: 9, department: "Produce", avatar: "SJ" },
    { id: 2, name: "Mike Chen", points: 2890, level: 8, department: "Dairy", avatar: "MC" },
    { id: 3, name: "You", points: 2450, level: 7, department: "Bakery", avatar: "YU", isCurrentUser: true },
    { id: 4, name: "Emma Davis", points: 2100, level: 6, department: "Meat", avatar: "ED" },
    { id: 5, name: "Alex Rodriguez", points: 1950, level: 6, department: "Frozen", avatar: "AR" },
  ])

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Waste Warrior",
      description: "Reduce spoilage by 20% this week",
      progress: 75,
      reward: 500,
      deadline: "2 days left",
      type: "weekly",
    },
    {
      id: 2,
      title: "Donation Hero",
      description: "Complete 5 donations this month",
      progress: 60,
      reward: 300,
      deadline: "12 days left",
      type: "monthly",
    },
    {
      id: 3,
      title: "Prediction Master",
      description: "Achieve 95% accuracy in spoilage predictions",
      progress: 90,
      reward: 750,
      deadline: "5 days left",
      type: "skill",
    },
  ])

  const [badges, setBadges] = useState([
    { id: 1, name: "First Donation", icon: Heart, earned: true, date: "2024-01-15" },
    { id: 2, name: "Waste Reducer", icon: Leaf, earned: true, date: "2024-01-20" },
    { id: 3, name: "Team Player", icon: Users, earned: true, date: "2024-02-01" },
    { id: 4, name: "Streak Master", icon: Zap, earned: true, date: "2024-02-10" },
    { id: 5, name: "Sustainability Champion", icon: Award, earned: false },
    { id: 6, name: "Innovation Leader", icon: Star, earned: false },
  ])

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "15-Day Streak!",
      description: "You've been actively reducing waste for 15 consecutive days",
      points: 200,
      timestamp: "2 hours ago",
      type: "streak",
    },
    {
      id: 2,
      title: "Donation Milestone",
      description: "Completed your 50th donation - 1,250 meals provided!",
      points: 500,
      timestamp: "1 day ago",
      type: "donation",
    },
    {
      id: 3,
      title: "Level Up!",
      description: "Congratulations! You've reached Level 7",
      points: 300,
      timestamp: "3 days ago",
      type: "level",
    },
  ])

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-6 w-6 text-gray-400" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sustainability Champions</h1>
        <p className="text-gray-600">Gamify your impact and compete with colleagues to reduce waste</p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Points</p>
              <p className="text-3xl font-bold">{userStats.points.toLocaleString()}</p>
            </div>
            <Star className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Level</p>
              <p className="text-3xl font-bold">{userStats.level}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Rank</p>
              <p className="text-3xl font-bold">#{userStats.rank}</p>
            </div>
            <Trophy className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Badges</p>
              <p className="text-3xl font-bold">{userStats.badges}</p>
            </div>
            <Award className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Streak</p>
              <p className="text-3xl font-bold">{userStats.streak}</p>
            </div>
            <Zap className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>This Week</option>
                <option>This Month</option>
                <option>All Time</option>
              </select>
            </div>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.isCurrentUser ? "bg-green-50 border-2 border-green-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(index + 1)}
                      <span className="font-bold text-lg">#{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.avatar}
                    </div>
                    <div>
                      <p className={`font-semibold ${user.isCurrentUser ? "text-green-900" : "text-gray-900"}`}>
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600">{user.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.points.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Level {user.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Challenges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Challenges</h2>
            <div className="space-y-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{challenge.reward} pts</p>
                      <p className="text-xs text-gray-500">{challenge.deadline}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(challenge.progress)}`}
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.type === "weekly"
                          ? "bg-blue-100 text-blue-800"
                          : challenge.type === "monthly"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {challenge.type}
                    </span>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      achievement.type === "streak"
                        ? "bg-red-100"
                        : achievement.type === "donation"
                          ? "bg-green-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {achievement.type === "streak" && <Zap className="h-4 w-4 text-red-600" />}
                    {achievement.type === "donation" && <Heart className="h-4 w-4 text-green-600" />}
                    {achievement.type === "level" && <Star className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-green-600 font-medium">+{achievement.points} pts</span>
                      <span className="text-xs text-gray-500">{achievement.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Collection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Badge Collection</h2>
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg text-center ${
                    badge.earned ? "bg-green-50 border-2 border-green-200" : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <badge.icon className={`h-8 w-8 mx-auto mb-2 ${badge.earned ? "text-green-600" : "text-gray-400"}`} />
                  <p className={`text-xs font-medium ${badge.earned ? "text-green-900" : "text-gray-500"}`}>
                    {badge.name}
                  </p>
                  {badge.earned && (
                    <p className="text-xs text-green-600 mt-1">{new Date(badge.date).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Store */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rewards Store</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Gift className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Coffee Voucher</p>
                    <p className="text-sm text-gray-600">Free coffee for a week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">500 pts</p>
                  <button className="text-xs text-purple-600 hover:text-purple-700">Redeem</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Gift className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Extra PTO Day</p>
                    <p className="text-sm text-gray-600">One additional day off</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">2000 pts</p>
                  <button className="text-xs text-gray-400">Need 450 more</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Gift className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Team Lunch</p>
                    <p className="text-sm text-gray-600">Lunch for your team</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">1500 pts</p>
                  <button className="text-xs text-green-600 hover:text-green-700">Redeem</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gamification
