import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from "react";
import OnRamp from './pages/OnRamp';
import Home from './pages/Home';
import Payment from './pages/Payment'
import ReviewOrder from './pages/ReviewOrder'
import LockOrder from './pages/LockOrder'
import { UserContext } from './context/UserContext.tsx';
import { PrivyProvider } from '@privy-io/react-auth';
import { ZeroDevProvider } from '@zerodev/privy';

function App() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(null);

  const handleLogin = (user) => {
    console.log(`User ${user.id} logged in!`)
  }

  return (
    <ZeroDevProvider projectId={process.env.REACT_APP_ZERODEV_APP_ID}>
      <PrivyProvider
        appId={process.env.REACT_APP_PRIVY_APP_ID}
        onSuccess={handleLogin}
        config={{
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            noPromptOnSignature: true
          }
        }}
      >
        <BrowserRouter>
          <UserContext.Provider value={{ user, setUser, amount, setAmount }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/onramp' element={<OnRamp />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/review' element={<ReviewOrder />} />
              <Route path='/lock' element={<LockOrder />} />
            </Routes>
          </UserContext.Provider>
        </BrowserRouter>
      </ PrivyProvider>
    </ZeroDevProvider>
  );
}

export default App;
