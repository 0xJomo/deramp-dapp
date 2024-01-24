import { useUserContext } from '../context/UserContext.tsx';
import { useEffect } from 'react';
import { Typography, Stack, Button, Divider } from '@mui/material';

export default function OrderDisplay({ useGrayBackground = false }) {

  const { amount, setAmount } = useUserContext()

  const componentClass = `rounded-2xl p-4 ${useGrayBackground ? 'bg-gray-300' : 'bg-white'}`;

  useEffect(() => {
    setAmount(localStorage.getItem('amount'))
  }, [setAmount])

  return (
    <Stack className={componentClass}>
      <Typography variant="h5">Get ${amount} of USDC</Typography>
      <Typography>Est. {amount} USDC</Typography>

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography>Transfer method</Typography>
        <Typography>Revolut</Typography>
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
        <Typography>$0.05</Typography>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
        <Typography variant="subtitle1">Total cost</Typography>
        <Typography>${parseInt(amount) + 0.05}</Typography>
      </Stack>
    </Stack>
  )
}