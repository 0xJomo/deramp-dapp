import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button } from '@mui/material';

import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { logout, ready, authenticated, zeroDevReady } = usePrivySmartAccount();
  const { login } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && authenticated && zeroDevReady) {
      navigate('/profile')
    }
  }, [ready, authenticated, zeroDevReady])

  return (
    <Stack alignItems={"center"} justifyContent={"center"} gap={10} sx={{ minHeight: "100vh", paddingX: 3 }}>
      <Typography variant="h2">DeRamp</Typography>

      <Typography variant="h4" textAlign={"center"}>The cheapest & fastest crypto on-ramp</Typography>

      <Stack sx={{ minWidth: "100%" }}>
        <Button variant="contained" sx={{ borderRadius: 1.5, minWidth: "100%" }} onClick={() => {
          if (ready && authenticated && zeroDevReady) {
            navigate("/profile")
          } else {
            login()
          }
        }}>
          Get Crypto
        </Button>
        {ready && authenticated && <Button variant='outline' onClick={logout}>
          Log out
        </Button>}
      </Stack>
    </Stack>
  );
}