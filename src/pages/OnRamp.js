import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function OnRamp() {
  const { setAmount } = useUserContext()
  const [text, setText] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme()

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
    <Stack justifyContent="space-evenly" alignItems="center" sx={{ paddingX: 1.5, minHeight: "100vh" }}>

      <Stack alignItems="center" justifyContent="space-between" >
        <Stack flexDirection="row" alignItems="center" justifyContent="center" sx={{ marginY: 2 }}>
          <Typography variant="h2">$</Typography>
          <input
            type="text"
            value={text}
            className='text-5xl font-extrabold focus:outline-none w-8'
            placeholder='0'
            onChange={handleInputChangeAndAdjustWidth}
          />
        </Stack>
        <Typography variant="h5">{text || 0}.00 USDC</Typography>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between">
        <Button sx={{ backgroundColor: theme.palette.secondary.dark }} variant="contained" sx={{ fontWeight: 700, paddingY: 0.5, paddingX: 1, borderRadius: 4, margin: 1 }} onClick={() => setAmountAndRedirect(20)}>
          $20
        </Button>
        <Button sx={{ backgroundColor: theme.palette.secondary.dark }} variant="contained" sx={{ fontWeight: 700, paddingY: 0.5, paddingX: 1, borderRadius: 4, margin: 1 }} onClick={() => setAmountAndRedirect(50)}>
          $50
        </Button>
        <Button sx={{ backgroundColor: theme.palette.secondary.dark }} variant="contained" sx={{ fontWeight: 700, paddingY: 0.5, paddingX: 1, borderRadius: 4, margin: 1 }} onClick={() => setAmountAndRedirect(100)}>
          $100
        </Button>
      </Stack>

      <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 10, minWidth: "100%" }} onClick={() => setAmountAndRedirect(parseInt(text))}>
        Next
      </Button>
    </Stack >
  );
}