import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from "react";
import OnRamp from './pages/OnRamp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Payment from './pages/Payment'
import ReviewOrder from './pages/ReviewOrder'
import ProcessBuyOrder from './pages/ProcessBuyOrder.js'
import { UserContext } from './context/UserContext.tsx';
import { PrivyProvider } from '@privy-io/react-auth';
import { ZeroDevProvider } from '@zerodev/privy';
import typography from './theme/typography.ts';
import palette from './theme/palette.ts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import * as buffer from "buffer";
import Logout from './pages/Logout';
window.Buffer = buffer.Buffer;

function App() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  const handleLogin = (user) => {
    console.log(`User ${user.id} logged in!`)
  }

  const theme = createTheme({
    typography: typography,
    palette: palette("light"),
  });

  return (
    <ThemeProvider theme={theme}>
      <ZeroDevProvider projectId={process.env.REACT_APP_ZERODEV_APP_ID}>
        <PrivyProvider
          appId={process.env.REACT_APP_PRIVY_APP_ID}
          onSuccess={handleLogin}
          config={{
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
              noPromptOnSignature: true,
            },
          }}
        >
          <BrowserRouter>
            <UserContext.Provider value={{ user, setUser, amount, setAmount, activeOrder, setActiveOrder }}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/onramp' element={<OnRamp />} />
                <Route path='/payment' element={<Payment />} />
                <Route path='/review' element={<ReviewOrder />} />
                <Route path='/buy' element={<ProcessBuyOrder />} />
                <Route path='/logout' element={<Logout />} />
              </Routes>
            </UserContext.Provider>
          </BrowserRouter>
        </ PrivyProvider>
      </ZeroDevProvider>
    </ThemeProvider>
  );
}

export default App;
