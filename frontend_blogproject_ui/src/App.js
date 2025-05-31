import Layout from './components/pages/layout';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Login from './components/pages/Auth/Login';
import ResetPin from './components/pages/Auth/Resetpin';
import ChangePin from './components/pages/Auth/ChangePin';
import PinLink from './components/pages/Auth/PinLink'
import { useSelector } from 'react-redux';
import DelayedNavigate from './components/utils/DelayedNavigate';

function ProtectedRoute({ children }) {
  const { access_token } = useSelector((state) => state.auth);
  return access_token ? children : <Navigate to="/login" replace />;
}




function App() {
  const {access_token} = useSelector((state)=> state.auth)
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home /> } />
            <Route path='api/user/reset/:uid/:token' element={< ResetPin/>} />
            {/* <Route index element={access_token ? <Home /> : <Navigate to="login" />} /> */}
            {/* Auth routes */}
            <Route path='contact' element={< Contact/>} />
            <Route path='resetpin_link' element={< PinLink/>} />
            <Route path="login" element={!access_token ? <Login /> : <DelayedNavigate to="/" delay={100} /> } />
            <Route path='changepin' element={<ProtectedRoute><ChangePin /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter> 
    </>
  );
}

export default App;
