import { useUserContext } from '../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Typography, Stack, Divider, IconButton, Collapse } from '@mui/material';
import Iconify from '../components/iconify/Iconify.tsx';

export default function OrderDisplay({ useGrayBackground = false, collapsable = false }) {

  const { amount, setAmount, platform, setPlatform } = useUserContext()
  const [folded, setFolded] = useState(true)
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
    <Stack className={componentClass} width={1}>
      <Stack flexDirection={"row"} justifyContent={"space-between"}>
        <Stack>
          <Typography variant="h5">Get ${amount && amount.toFixed(2)} of USDC</Typography>
          <Typography>Est. {amount && amount.toFixed(2)} USDC</Typography>
        </Stack>
        {collapsable && folded &&
          <IconButton onClick={() => { setFolded(false) }}>
            <Iconify height={36} width={36} color={"primary.main"} icon="solar:round-alt-arrow-down-bold" />
          </IconButton>
        }
        {collapsable && !folded &&
          <IconButton onClick={() => { setFolded(true) }}>
            <Iconify height={36} width={36} color={"primary.main"} icon="solar:round-alt-arrow-up-bold" />
          </IconButton>
        }
      </Stack>

      <Collapse in={!collapsable || !folded}>
        <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
          <Typography>Transfer method</Typography>
          <Typography>{(platform === "revolut" && "Revolut") || null}</Typography>
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
          <Typography>Network</Typography>
          <Typography>Blast</Typography>
        </Stack>

        <Divider sx={{ marginTop: 4 }} />

        <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 4 }} >
          <Typography>Rate</Typography>
          <Typography>1 USDC = $1.00</Typography>
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
          <Typography>Fee</Typography>
          <Typography>${fee != null && fee.toFixed(2)}</Typography>
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
          <Typography variant="subtitle1">Total cost</Typography>
          <Typography>${amount && (parseFloat(amount) + fee).toFixed(2)}</Typography>
        </Stack>
      </Collapse>
    </Stack>
  )
}