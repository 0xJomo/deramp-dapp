import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button } from '@mui/material';

export default function Profile() {
  const { login, logout, ready, authenticated, user, zeroDevReady, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();

  return (
    <Stack justifyContent="flex-start" alignItems="center" sx={{ minHeight: "100vh", paddingX: 3 }}>
      <Typography variant="h3" sx={{ marginTop: 6, marignBottom: 2 }}>$100.00</Typography>

      <Stack flexDirection="row">
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }} onClick={() => navigate("/onramp")}>
          Get Crypto
        </Button>
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }}>
          Cash Out
        </Button>
      </Stack>

      <Stack sx={{ minWidth: "100%", marginTop: 2 }} flexDirection="row">
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