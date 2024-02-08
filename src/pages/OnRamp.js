import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Input } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function OnRamp() {
  const { setAmount } = useUserContext()
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const theme = useTheme()

  const setAmountAndRedirect = (value) => {
    if (!value || value === 0.0) return
    setAmount(parseFloat(value));
    localStorage.setItem("onramp_amount", value)
    navigate("/payment")
  }

  const handleInputChangeAndAdjustWidth = (e) => {
    var value = e.target.value;
    if (value.startsWith("0")) value = ""
    if (parseFloat(value) < 1) value = ""
    if (value.startsWith("100")) value = "100"
    if (parseFloat(value) > 100) value = "100"
    const shortValue = parseFloat(value).toFixed(2)
    if (shortValue.length - value.length < 0) {
      value = value.substring(0, shortValue.length)
    }
    setText(value);
  };

  return (
    <Stack justifyContent="space-evenly" alignItems="center" sx={{ paddingX: 1.5, minHeight: "100vh" }}>

      <Stack alignItems="center" justifyContent="space-between" >
        <Stack flexDirection="row" alignItems="center" justifyContent="center" sx={{ marginY: 2 }}>
          <Typography variant="h2">$</Typography>
          <Input
            type="number"
            value={text}
            style={{ width: "6.5rem" }}
            placeholder='0.00'
            autoFocus={true}
            disableUnderline={true}
            sx={{ fontSize: "2.5rem" }}
            onChange={handleInputChangeAndAdjustWidth}
          />
        </Stack>
        <Typography variant="h5">{(parseFloat(text) || 0).toFixed(2)} USDC</Typography>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between">
        <Button sx={{ backgroundColor: theme.palette.secondary.dark, fontWeight: 700, paddingY: 0.5, paddingX: 1, borderRadius: 4, margin: 1 }} variant="contained" onClick={() => setAmountAndRedirect(20)}>
          $20
        </Button>
        <Button sx={{ backgroundColor: theme.palette.secondary.dark, fontWeight: 700, paddingY: 0.5, paddingX: 1, borderRadius: 4, margin: 1 }} variant="contained" onClick={() => setAmountAndRedirect(50)}>
          $50
        </Button>
        <Button sx={{ backgroundColor: theme.palette.secondary.dark, fontWeight: 700, paddingY: 0.5, paddingX: 1, borderRadius: 4, margin: 1 }} variant="contained" onClick={() => setAmountAndRedirect(100)}>
          $100
        </Button>
      </Stack>

      <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 10, minWidth: "100%" }} onClick={() => setAmountAndRedirect(parseFloat(text))}>
        Next
      </Button>
    </Stack >
  );
}