import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext.jsx'
import { useWallet } from './context/WalletContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Verify from './pages/Verify.jsx'
import Feed from './pages/Feed.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoanDetail from './pages/LoanDetail.jsx'
import Circles from './pages/Circles.jsx'
import ChatBot from './components/ChatBot.jsx'
import Settings from './pages/Settings.jsx'

/**
 * RoleWatcher ΓÇö rendered INSIDE BrowserRouter so useNavigate works.
 *
 * Watches the justConnected signal from WalletContext.
 * When a fresh wallet connection happens:
 *   ΓÇó no role set  ΓåÆ redirect to /onboarding
 *   ΓÇó role exists  ΓåÆ redirect to /dashboard
 *
 * This is the ONLY correct way to navigate from a wallet connect event,
 * because WalletProvider wraps BrowserRouter and cannot call useNavigate.
 */
function RoleWatcher() {
  const { justConnected, clearJustConnected, userRole } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    if (!justConnected) return

    // Consume the signal immediately so it only fires once
    clearJustConnected()

    if (!userRole) {
      navigate('/onboarding', { replace: true })
    } else {
      // Role already set ΓÇö go straight to the right place
      const dest = userRole === 'lender' ? '/feed' : '/dashboard'
      navigate(dest, { replace: true })
    }
  }, [justConnected])

  return null // renders nothing ΓÇö pure side-effect component
}

/* ΓöÇΓöÇ Role-aware guard for borrower-only pages ΓöÇΓöÇ */
function BorrowerGuard({ children }) {
  const { isConnected, userRole, isBorrower } = useWallet()

  // Not connected or no role ΓåÆ let them through (page handles it)
  if (!isConnected || !userRole) return children

  // Lender-only tries to visit borrower route ΓåÆ soft-block, not hard redirect
  if (!isBorrower) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center border border-amber-500/30 bg-amber-500/5">
          <div className="text-4xl mb-4">≡ƒÅª</div>
          <h2 className="font-display font-bold text-white text-xl mb-3">
            Borrower Mode Required
          </h2>
          <p className="text-grey text-sm mb-6">
            You're currently set as a <strong className="text-teal">Lender</strong>.
            Switch to Borrower mode to get verified and list loans.
          </p>
          <div className="flex gap-3">
            <SwitchRoleBtn to="borrower" label="Switch to Borrower" />
            <BackBtn />
          </div>
        </div>
      </div>
    )
  }

  return children
}

function SwitchRoleBtn({ to, label }) {
  const { setRole } = useWallet()
  const navigate    = useNavigate()
  return (
    <button
      onClick={() => { setRole(to); navigate('/verify') }}
      className="btn-primary flex-1 justify-center"
    >
      {label}
    </button>
  )
}

function BackBtn() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">
      Go Back
    </button>
  )
}

export default function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-canvas text-primary">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/"           element={<Landing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/feed"       element={<Feed />} />
              <Route path="/loan/:id"   element={<LoanDetail />} />
              <Route path="/profile"    element={<Profile />} />
              <Route path="/circles"    element={<Circles />} />
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/settings"   element={<Settings />} />

              {/* Borrower-guided */}
              <Route path="/verify"     element={<BorrowerGuard><Verify /></BorrowerGuard>} />

              {/* Catch-all */}
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </BrowserRouter>
    </WalletProvider>
  )
}