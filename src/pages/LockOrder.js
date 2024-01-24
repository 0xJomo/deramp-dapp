import OrderDisplay from "./OrderDisplay"
import { useUserContext } from '../context/UserContext.tsx';
import { useState, useEffect } from "react";
import { Typography, Stack, Button, Box } from '@mui/material';

function ConfirmTransferBottomsheet() {
  return (
    <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "white" }}>
      <Typography variant="h5">Confirm transfer</Typography>
      <Typography textAlign={"center"}>Please complete your transfer of exactly $100.05 on Revolut to @arthaud, then
        verify the transaction on DeRamp. Transferring more than $100.05 could result in a loss of funds.
      </Typography>
      <Button>
        I have completed my transfer
      </Button>
      <Typography sx={{ marginY: 1 }}>
        Return to Revolut to complete my transfer
      </Typography>
    </Stack>
  )
}

function SendWithRevolutBottomsheet() {
  return (
    <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "white" }}>
      <Typography variant="h5">Send with Revolut</Typography>
      <Typography textAlign={"center"}>Please complete your transfer of exactly $100.05 on Revolut to @arthaud, then verify the transaction on DeRamp.
        Transferring more than $100.05 could result in a loss of funds.
      </Typography>
      <Button variant="contained">
        Go to Revolut
      </Button>
    </Stack>
  )
}

function AddJomoCopilotBottomsheet() {
  return (
    <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "white" }}>
      <Typography variant="h5">Add Jomo Copilot</Typography>
      <Typography textAlign={"center"}>
        Jomo Copilot on Firefox is required to verify peer-to-peer transfers on apps like Revolut
        and Venmo to then send you crypto on-chain. Jomo uses cryptography so that your user data is not read or stored any where.
      </Typography>
      <Button variant="contained">
        I have completed my transfer
      </Button>
      <Typography sx={{ marginY: 1 }}>
        Add Jomo Copilot on Firefox
      </Typography>
    </Stack>
  )
}

export default function LockOrder() {

  const { amount } = useUserContext()
  // reviewOrder, pendingSendFiat, pendingVerifyTransfer, addCopilot, pendingVerifyWithCopilot, verifying, verified, received
  const [orderStatus, setOrderStatus] = useState("reviewOrder")

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 2, marginY: 4, padding: 1 }}>
      <OrderDisplay useGrayBackground={true} />

      <Stack sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Complete your transfer on Revolut</Typography>

        <Stack flexDirection="row" alignItems="center" sx={{ marginBottom: 2 }} >
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "gray", marginRight: 2 }} />
          <Typography variant="subtitle1">Send ${amount} on Revolut</Typography>
        </Stack>

        <Stack flexDirection="row" alignItems="center" sx={{ marginBottom: 2 }} >
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "gray", marginRight: 2 }} />
          <Typography variant="subtitle1">Verify Revolut transfer</Typography>
        </Stack>

        <Stack flexDirection="row" alignItems="center" sx={{ marginBottom: 2 }} >
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "gray", marginRight: 2 }} />
          <Typography variant="subtitle1">Receive ${amount} of USDC on DeRamp</Typography>
        </Stack>
      </Stack>

      <Button variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => setOrderStatus("pendingSendFiat")}>
        Send with Revolut
      </Button>

      {orderStatus === "pendingSendFiat" && <SendWithRevolutBottomsheet />}
    </Stack >
  )
}