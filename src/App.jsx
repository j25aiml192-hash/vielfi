import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext.jsx'
import { useWallet } from './context/WalletContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AppSidebar from './components/AppSidebar.jsx'
import Landing from './pages/Landing.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Verify from './pages/Verify.jsx'
import Feed from './pages/Feed.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoanDetail from './pages/LoanDetail.jsx'
import Circles from './pages/Circles.jsx'
import Settings from './pages/Settings.jsx'
import CreateLoan from './pages/CreateLoan.jsx'
import ChatBot from './components/ChatBot.jsx'

/* ΓöÇΓöÇ Pages that should NOT have the sidebar ΓöÇΓöÇ */
const NO_SIDEBAR = ['/', '/onboarding']

/**
 * RoleWatcher ΓÇö inside BrowserRouter so useNavigate works.
 */
function RoleWatcher() {
  const { justConnected, clearJustConnected, userRole } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    if (!justConnected) return
    clearJustConnected()
    if (!userRole) {
      navigate('/onboarding', { replace: true })
    } else {
      const dest = userRole === 'lender' ? '/feed' : '/dashboard'
      navigate(dest, { replace: true })
    }
  }, [justConnected])

  return null
}

/* ΓöÇΓöÇ Borrower guard ΓöÇΓöÇ */
function BorrowerGuard({ children }) {
  const { isConnected, userRole, isBorrower } = useWallet()
  const navigate = useNavigate()

  if (!isConnected || !userRole) return children
  if (!isBorrower) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center border border-amber-500/30 bg-amber-500/5">
          <div className="text-4xl mb-4">≡ƒÅª</div>
          <h2 className="font-display font-bold text-white text-xl mb-3">Borrower Mode Required</h2>
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
    <button onClick={() => { setRole(to); navigate('/verify') }} className="btn-primary flex-1 justify-center">
      {label}
    </button>
  )
}

function BackBtn() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">Go Back</button>
}

/* ΓöÇΓöÇ Layout that conditionally shows the sidebar ΓöÇΓöÇ */
function AppLayout({ children }) {
  const location = useLocation()
  const showSidebar = !NO_SIDEBAR.includes(location.pathname)

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* NitiSetu-style sidebar ΓÇö hidden on Landing & Onboarding */}
      {showSidebar && <AppSidebar />}

      {/* Main content column */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <Navbar />
        <main style={{ flex:1 }}>
          {children}
        </main>
        <Footer />
        <ChatBot />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <RoleWatcher />
        <AppLayout>
          <Routes>
            {/* Public ΓÇö no sidebar */}
            <Route path="/"           element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* App pages ΓÇö with sidebar */}
            <Route path="/feed"       element={<Feed />} />
            <Route path="/loan/:id"   element={<LoanDetail />} />
            <Route path="/profile"    element={<Profile />} />
            <Route path="/circles"    element={<Circles />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="/loans/create"  element={<CreateLoan />} />

            {/* Borrower-guided */}
            <Route path="/verify"     element={<BorrowerGuard><Verify /></BorrowerGuard>} />

            {/* Catch-all */}
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </WalletProvider>
  )
}