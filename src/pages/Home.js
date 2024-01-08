import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { setAmount } = useUserContext()
  const [text, setText] = useState(null);
  const navigate = useNavigate();

  const setAmountAndRedirect = (value) => {
    setAmount(value);
    localStorage.setItem("amount", value);
    navigate("/payment")
  }

  const handleInputChangeAndAdjustWidth = (e) => {
    const value = e.target.value;
    if (value.length === 0) {
      e.target.style.width = '2rem';
    } else {
      e.target.style.width = `${value.length}ch`;
    }
    setText(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly px-12">

      <div className="flex flex-col items-center justify-between">
        <div className='flex flex-row items-center justify-center my-8'>
          <h1>$</h1>
          <input
            type="text"
            value={text}
            className='text-5xl font-extrabold focus:outline-none w-8'
            placeholder='0'
            onChange={handleInputChangeAndAdjustWidth}
          />
        </div>
        <h3 className="text-xl font-bold">{text || 0}.00 USDC</h3>
      </div>

      <div className="flex flex-row items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4" onClick={() => setAmountAndRedirect(20)}>
          $20
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4" onClick={() => setAmountAndRedirect(50)}>
          $50
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4" onClick={() => setAmountAndRedirect(100)}>
          $100
        </button>
      </div>

      <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full" onClick={() => setAmountAndRedirect(parseInt(text))}>
        Next
      </button>
    </main >
  );
}