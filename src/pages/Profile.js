import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button } from '@mui/material';

export default function Profile() {
  const { ready, authenticated, zeroDevReady, getAccessToken, getEthereumProvider } = usePrivySmartAccount();
  const navigate = useNavigate();
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (ready && authenticated && zeroDevReady) {
      if (isFirstMount.current) {
        isFirstMount.current = false
        getAccessToken().then((token) => {
          localStorage.setItem("access_token", token)
        })
        getEthereumProvider().getAddress().then((address) => console.log(address))
      }
    }
  }, [ready, authenticated, zeroDevReady])

  return (
    <Stack justifyContent="flex-start" alignItems="center" sx={{ minHeight: "100vh", paddingX: 3 }}>
      <Typography variant="h2" sx={{ marginTop: 6, marginBottom: 2 }}>$100.00</Typography>

      <Stack flexDirection="row">
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }} onClick={() => navigate("/onramp")}>
          Get Crypto
        </Button>
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }}>
          Cash Out
        </Button>
      </Stack>

      <Stack sx={{ minWidth: "100%", marginTop: 4 }} flexDirection="row">
        <img
          src="/images/USDC.png"
          alt="USDC"
          width={48}
          height={48}
        />
        <Stack flexGrow={1} sx={{ marginLeft: 1 }}>
          <Typography variant="h6">USDC</Typography >
          <Typography>100.00 USDC</Typography>
        </Stack>
        <Typography variant="h6">$100.00</Typography>
      </Stack>
    </Stack >
  );
}