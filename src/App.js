import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from "react";
import Home from './pages/Home';
import Payment from './pages/Payment'
import ReviewOrder from './pages/ReviewOrder'
import LockOrder from './pages/LockOrder'
import { UserContext } from './context/UserContext.tsx';

function App() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser, amount, setAmount }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/review' element={<ReviewOrder />} />
          <Route path='/lock' element={<LockOrder />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
