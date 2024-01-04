import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Payment from './pages/Payment'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/payment' element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
