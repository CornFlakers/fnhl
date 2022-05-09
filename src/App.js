import './index.css'                                                                                           
import {LeagueNavBar} from './components/LeagueNavBar'
import {MainNavBar} from './components/MainNavBar'
import {NavBar} from './components/NavBar'
import {Footer} from './components/Footer'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext'
import Signin from './components/Signin'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './components/Signup'
import ManageLeague from './components/ManageLeague'
import Manage from './components/Manage'
import Home from './components/Home'
import Scores from './components/Scores'
import News from './components/News'
import History from './components/History'
import Standings from './components/Standings'
import Stats from './components/Stats'
import Schedule from './components/Schedule'
import Players from './components/Players'
import Teams from './components/Teams'
import ManageTeam from './components/ManageTeam'
import {ErrorBoundary} from './components/ErrorBoundary.jsx'
function App() {
  return (
    <div className='App'>
      <AuthContextProvider>
        <NavBar />
          <div className='bg-gray-100'>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/home' element={<Home />} />
              <Route path='/scores' element={<Scores />} />
              <Route path='/news' element={<News />} />
              <Route path='/standings' element={<Standings />} />
              <Route path='/stats' element={<Stats />} />
              <Route path='/schedule' element={<Schedule />} />
              <Route path='/players' element={<Players />} />
              <Route path='/teams' element={<Teams />} />
              <Route path='/history' element={<History />} />
              <Route path='/manage_league' element=
                {
                  <ProtectedRoute>
                    <ManageLeague />
                  </ProtectedRoute>
                } 
              />
              <Route path='/manage' element=
                {
                  <ProtectedRoute>
                    <ErrorBoundary><Manage /></ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route path='/manage_team' element=
                {
                  <ProtectedRoute>
                    <ManageTeam />
                  </ProtectedRoute>
                } 
              />
          </Routes>
        <Footer />
        </div>
      </AuthContextProvider>
    </div>
  )
}

export default App