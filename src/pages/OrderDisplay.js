import { useUserContext } from '../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Typography, Stack, Divider } from '@mui/material';

export default function OrderDisplay({ useGrayBackground = false }) {

  const { amount, setAmount, platform, setPlatform } = useUserContext()
  const navigate = useNavigate();

  const fee = 0.0

  const componentClass = `rounded-2xl p-4 ${useGrayBackground ? 'bg-gray-300' : 'bg-white'}`;

  useEffect(() => {
    const storedAmount = localStorage.getItem('onramp_amount')
    const storedPlatform = localStorage.getItem('onramp_platform')
    if (!storedAmount) {
      navigate('/onramp')
      return
    }
    if (!storedPlatform) {
      navigate('/payment')
      return
    }

    setAmount(parseFloat(storedAmount))
    setPlatform(storedPlatform)
  }, [setAmount, setPlatform])

  return (
    <Stack className={componentClass}>
      <Typography variant="h5">Get ${amount} of USDC</Typography>
      <Typography>Est. {amount} USDC</Typography>

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography>Transfer method</Typography>
        <Typography>{(platform === "revolut" && "Revolut") || null}</Typography>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography>Network</Typography>
        <Typography>Arbitrum</Typography>
      </Stack>

      <Divider sx={{ marginTop: 4 }} />

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography>Rate</Typography>
        <Typography>1 USDC = $1.00</Typography>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography>Fee</Typography>
        <Typography>${fee.toFixed(2)}</Typography>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography variant="subtitle1">Total cost</Typography>
        <Typography>${parseFloat(amount) + fee}</Typography>
      </Stack>
    </Stack>
  )
}