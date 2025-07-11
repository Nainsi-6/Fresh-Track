// "use client"
// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { Leaf, Menu, X, User, LogOut } from "lucide-react"
// import { useAuth } from "../hooks/useAuth"

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [showUserMenu, setShowUserMenu] = useState(false)
//   const { user, isAuthenticated, logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate("/")
//     setShowUserMenu(false)
//   }

//   const navigation = [
//     { name: "Home", href: "/" },
//     { name: "About", href: "/about" },
//     { name: "Contact", href: "/contact" },
//   ]

//   const authenticatedNavigation = [
//     { name: "Dashboard", href: "/dashboard" },
//     { name: "Analytics", href: "/analytics" },
//     { name: "Donations", href: "/donations" },
//     { name: "Alerts", href: "/alerts" },
//   ]

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2">
//               <Leaf className="h-8 w-8 text-green-600" />
//               <span className="text-xl font-bold text-gray-900">FreshTrack</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {isAuthenticated
//               ? authenticatedNavigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                   >
//                     {item.name}
//                   </Link>
//                 ))
//               : navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                   >
//                     {item.name}
//                   </Link>
//                 ))}

//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   <User className="h-5 w-5" />
//                   <span>{user?.name || "User"}</span>
//                 </button>

//                 {showUserMenu && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//                     <div className="px-4 py-2 text-sm text-gray-700 border-b">
//                       <div className="font-medium">{user?.name}</div>
//                       <div className="text-gray-500">{user?.email}</div>
//                       <div className="text-xs text-green-600 capitalize">{user?.role}</div>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <LogOut className="h-4 w-4 mr-2" />
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link
//                   to="/login"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600"
//             >
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
//             {isAuthenticated
//               ? authenticatedNavigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                 ))
//               : navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}

//             {isAuthenticated ? (
//               <div className="border-t pt-4">
//                 <div className="px-3 py-2">
//                   <div className="text-base font-medium text-gray-800">{user?.name}</div>
//                   <div className="text-sm text-gray-500">{user?.email}</div>
//                   <div className="text-xs text-green-600 capitalize">{user?.role}</div>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
//                 >
//                   <LogOut className="h-5 w-5 mr-2" />
//                   Sign out
//                 </button>
//               </div>
//             ) : (
//               <div className="border-t pt-4 space-y-1">
//                 <Link
//                   to="/login"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-green-600 text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium transition-colors mx-3"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }

// export default Navbar


"use client"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Leaf, Menu, X, User, LogOut, Bell, Trophy, Zap, BarChart3, Heart } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import NotificationCenter from "./NotificationCenter"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setShowUserMenu(false)
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const authenticatedNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Products", href: "/products", icon: Leaf },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Donations", href: "/donations", icon: Heart },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Champions", href: "/gamification", icon: Trophy },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">FreshTrack</span>
                <div className="text-xs text-green-600 font-medium">AI-Powered Waste Reduction</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated
              ? authenticatedNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-green-600 bg-green-50 shadow-sm"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))
              : navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                {/* Notification Center */}
                <NotificationCenter />

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/gamification"
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="View Leaderboard"
                  >
                    <Trophy className="h-5 w-5" />
                  </Link>
                  <button
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Run ML Predictions"
                  >
                    <Zap className="h-5 w-5" />
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-green-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{user?.name || "User"}</div>
                      <div className="text-xs text-green-600 capitalize">{user?.role || "Manager"}</div>
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user?.name}</div>
                              <div className="text-sm text-gray-500">{user?.email}</div>
                              <div className="text-xs text-green-600 capitalize font-medium">{user?.role}</div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="text-xs text-gray-500 mb-2">Your Impact Today</div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="text-center">
                              <div className="font-bold text-green-600">2,450</div>
                              <div className="text-gray-500">Points</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-blue-600">Level 7</div>
                              <div className="text-gray-500">Rank #3</div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <BarChart3 className="h-4 w-4 mr-3" />
                            Dashboard
                          </Link>
                          <Link
                            to="/gamification"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Trophy className="h-4 w-4 mr-3" />
                            Leaderboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign out
                          </button>
                        </div>
                      </div>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-green-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && <NotificationCenter />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 p-2 rounded-lg hover:bg-green-50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {isAuthenticated
              ? authenticatedNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))
              : navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                {/* Mobile User Info */}
                <div className="px-3 py-3 bg-gray-50 rounded-lg mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      <div className="text-xs text-green-600 capitalize font-medium">{user?.role}</div>
                    </div>
                  </div>

                  {/* Mobile Quick Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center bg-white rounded p-2">
                      <div className="font-bold text-green-600">2,450</div>
                      <div className="text-gray-500">Points</div>
                    </div>
                    <div className="text-center bg-white rounded p-2">
                      <div className="font-bold text-blue-600">Level 7</div>
                      <div className="text-gray-500">Rank #3</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 px-3 py-3 rounded-lg text-base font-medium transition-colors mx-0"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
