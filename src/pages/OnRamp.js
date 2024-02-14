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
    if (value.length === 0) {
      e.target.parentNode.style.width = '4.8rem'
    } else {
      var len = value.length * 1.6 + 0.5
      if (value.includes('.')) len -= 1.6
      e.target.parentNode.style.width = `${len}rem`
    }
    setText(value);
  };

  return (
    <Stack alignItems="center" sx={{ paddingX: 1.5, minHeight: "100vh" }}>

      <Typography variant="subtitle2" mt={2}>Get USDC</Typography>

      <Stack flexGrow={1} gap={10} alignItems="center" width={1} justifyContent={"center"} maxHeight={"600px"}>
        <Stack alignItems={"center"}>
          <Stack flexDirection="row" alignItems="center" justifyContent="center" sx={{ marginY: 2 }}>
            <Typography variant="h2">$</Typography>
            <Input
              type="number"
              value={text}
              style={{}}
              placeholder='0.00'
              autoFocus={true}
              disableUnderline={true}
              sx={{ fontSize: "2.5rem", width: "4.8rem" }}
              onChange={handleInputChangeAndAdjustWidth}
            />
          </Stack>
          <Typography variant="h5">{(parseFloat(text) || 0).toFixed(2)} USDC</Typography>
        </Stack>
        <Stack flexDirection="row" justifyContent="center" gap={4} width={"300px"}>
          <Button sx={{ borderRadius: 4, margin: 1 }} variant="contained" onClick={() => setAmountAndRedirect(20)}>
            $20
          </Button>
          <Button sx={{ borderRadius: 4, margin: 1 }} variant="contained" onClick={() => setAmountAndRedirect(50)}>
            $50
          </Button>
          <Button sx={{ borderRadius: 4, margin: 1 }} variant="contained" onClick={() => setAmountAndRedirect(100)}>
            $100
          </Button>
        </Stack>

        <Button color="secondary" variant="contained" sx={{ borderRadius: 10, width: "300px" }} onClick={() => setAmountAndRedirect(parseFloat(text))}>
          Next
        </Button>
      </Stack>

    </Stack >
  );
}