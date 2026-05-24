import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Verify from './pages/Verify.jsx'
import Feed from './pages/Feed.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoanDetail from './pages/LoanDetail.jsx'
import Circles from './pages/Circles.jsx'

export default function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-bg text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"           element={<Landing />} />
              <Route path="/verify"     element={<Verify />} />
              <Route path="/feed"       element={<Feed />} />
              <Route path="/profile"    element={<Profile />} />
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/loan/:id"   element={<LoanDetail />} />
              <Route path="/circles"    element={<Circles />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </WalletProvider>
  )
}
