import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button } from '@mui/material';

export default function Payment() {

  const navigate = useNavigate();

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 4, marginY: 8 }} alignItems={"flex-start"}>
      <Typography>
        Choose a peer-to-peer transfer method
      </Typography>

      <Button sx={{ marginY: 2, borderRadius: 1, padding: 1 }} onClick={() => navigate("/review")}>
        <Stack flexDirection={"row"} alignItems={"center"} >
          <img
            src="/images/revolut.png"
            alt="revolut"
          />
          <Stack justifyContent={"flex-start"} alignItems={"flex-start"} sx={{ marginX: 1 }} >
            <Typography sx={{ fontWeight: 700 }}>Revolut</Typography>
            <Typography sx={{ textAlign: "left" }}>No additional KYC, transfer directly P2P</Typography>
          </Stack>
        </Stack>
      </Button>
    </Stack>
  )
}