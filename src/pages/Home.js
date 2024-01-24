import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button } from '@mui/material';

export default function Home() {
  const { login, logout, ready, authenticated, user, zeroDevReady, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();

  if (ready && authenticated && zeroDevReady) {
    console.log(user)
    navigate("/profile")
  }

  return (
    <Stack alignItems={"center"} justifyContent={"space-evenly"} sx={{ minHeight: "100vh", paddingX: 3 }}>
      <Typography variant="h2">DeRamp</Typography>

      <Stack sx={{ minWidth: "100%" }}>
        <Button variant="contained" sx={{ borderRadius: 1.5, minWidth: "100%" }} onClick={login}>
          Get Crypto
        </Button>
        {ready && authenticated && <Typography textAlign={"center"} onClick={logout}>
          Log out
        </Typography>}
      </Stack>
    </Stack>
  );
}