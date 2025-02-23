import {BrowserRouter,Routes,Route} from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import UserDashboard from "./pages/UserDashboard"

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/dashboard" element={<UserDashboard/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App