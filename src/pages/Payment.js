import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button } from '@mui/material';
import { useUserContext } from '../context/UserContext.tsx';

export default function Payment() {

  const { setPlatform } = useUserContext()

  const navigate = useNavigate();

  const selectPayment = async function (paymentPlatform) {
    setPlatform(paymentPlatform)
    localStorage.setItem("onramp_platform", paymentPlatform)
    navigate("/review")
  }

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 4 }} alignItems={"center"} gap={2}>
      <Typography variant="subtitle2" mt={2} mb={2}>Payment method</Typography>

      <Typography variant="h5">
        Choose a peer-to-peer transfer method
      </Typography>

      <Button sx={{ borderRadius: 4, padding: 2, backgroundColor: "lightgrey" }} onClick={() => selectPayment("revolut")}>
        <Stack flexDirection={"row"} alignItems={"center"} >
          <img
            src="/images/revolut.png"
            alt="revolut"
          />
          <Stack justifyContent={"flex-start"} alignItems={"flex-start"} sx={{ marginX: 2 }} >
            <Typography variant="subtitle1">Revolut</Typography>
            <Typography variant="body1" sx={{ textAlign: "left" }}>No additional KYC, transfer directly P2P</Typography>
          </Stack>
        </Stack>
      </Button>
    </Stack>
  )
}