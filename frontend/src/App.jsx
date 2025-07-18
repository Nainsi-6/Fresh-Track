// "use client"

// import { useState } from "react"
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import Navbar from "./components/Navbar"
// import LandingPage from "./pages/LandingPage"
// import Dashboard from "./pages/Dashboard"
// import ProductDetail from "./pages/ProductDetail"
// import DonationManagement from "./pages/DonationManagement"
// import Analytics from "./pages/Analytics"
// import Alerts from "./pages/Alerts"
// import Login from "./pages/Login"
// import About from "./pages/About"
// import Contact from "./pages/Contact"

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [userRole, setUserRole] = useState("manager") // manager, staff, ngo

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//           <Route path="/donations" element={<DonationManagement />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/alerts" element={<Alerts />} />
//           <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App

// "use client"
// import { useState } from "react"
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { AuthProvider } from "./hooks/useAuth"
// import Navbar from "./components/Navbar"
// import LandingPage from "./pages/LandingPage"
// import Dashboard from "./pages/Dashboard"
// import ProductDetail from "./pages/ProductDetail"
// import DonationManagement from "./pages/DonationManagement"
// import Analytics from "./pages/Analytics"
// import Alerts from "./pages/Alerts"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import About from "./pages/About"
// import Contact from "./pages/Contact"

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [userRole, setUserRole] = useState("manager") // manager, staff, ngo

//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/product/:id" element={<ProductDetail />} />
//             <Route path="/donations" element={<DonationManagement />} />
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/alerts" element={<Alerts />} />
//             <Route
//               path="/login"
//               element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />}
//             />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import ProductDetail from "./pages/ProductDetail"
import ProductManagement from "./pages/ProductManagement"
import DonationManagement from "./pages/DonationManagement"
import Analytics from "./pages/Analytics"
import Alerts from "./pages/Alerts"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Contact from "./pages/Contact"
// Import the new gamification component
import Gamification from "./components/Gamification"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/donations" element={<DonationManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
