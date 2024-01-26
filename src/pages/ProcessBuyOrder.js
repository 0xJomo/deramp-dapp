import OrderDisplay from "./OrderDisplay.js"
import { useUserContext } from '../context/UserContext.tsx';
import { useState, useEffect } from "react";
import { Typography, Stack, Button, Link } from '@mui/material';
import VerticalLinearStepper from "../components/stepper/VerticalLinearStepper.tsx";

export default function ProcessBuyOrder() {

  const { activeOrder, setActiveOrder } = useUserContext()
  // reviewOrder, pendingSendFiat, pendingVerifyTransfer, addCopilot, pendingVerifyWithCopilot, verifying, verified, received
  const [bottomSheet, setBottomSheet] = useState("reviewOrder")
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = {
    stepIds: ['send_revolut_payment', 'verify_revolut_paymennt', 'receive_usdc'],
    stepDetails: {
      'send_revolut_payment': {
        stepIdx: 0,
        label: `Send $${activeOrder?.amount + activeOrder?.fee} on Revolut to @${activeOrder?.recipient_id}`,
        description: ``,
      },
      'verify_revolut_paymennt': {
        stepIdx: 1,
        label: 'Verify Revolut transfer',
        description: <>Jomo Co-pilot add-on is required to verify Revolut transfers. <Link>Install now</Link></>,
      },
      'receive_usdc': {
        stepIdx: 2,
        label: `Receive $${activeOrder?.amount} of USDC on DeRamp`,
        description: ``,
      },
    }
  };

  const renderStepLabel = function (step) {
    const label = STEPS.stepDetails[step].label
    return (
      <Typography variant="subtitle1">
        {label}
      </Typography>
    )
  }

  const renderStepContent = function (step, setActiveStep) {
    const description = STEPS.stepDetails[step].description

    return (
      <>
        <Typography variant="body1">{description}</Typography>
      </>
    )
  }

  const renderResetContent = function (step) {
    return (
      <>
        <Typography>Address Connected!</Typography>
      </>
    )
  }

  async function confirmTransferComplete() {
    setBottomSheet("")
    setActiveStep(1)
  }

  function ConfirmTransferBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Typography variant="h3" sx={{ marginTop: 2 }}>Confirm transfer</Typography>
        <Typography textAlign={"center"} sx={{ marginY: 2 }}>Please complete your transfer of exactly ${activeOrder?.amount + activeOrder?.fee} on Revolut to @{activeOrder?.recipient_id}, then
          verify the transaction on DeRamp. Transferring more than ${activeOrder?.amount + activeOrder?.fee} could result in a loss of funds.
        </Typography>
        <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={confirmTransferComplete}>
          I have completed my transfer
        </Button>
        <Button variant="text" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => setBottomSheet("pendingSendFiat")}>
          Return to Revolut to complete my transfer
        </Button>
      </Stack>
    )
  }

  async function redirectToRevolutPayment(order) {
    window.open(`https://revolut.me/${order.recipient_id}`, "_blank")
    setBottomSheet("confirmingTransfer")
  }

  function SendWithRevolutBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Typography variant="h3" sx={{ marginTop: 2 }}>Send with Revolut</Typography>
        <Typography textAlign={"center"} sx={{ marginY: 2 }}>Please complete your transfer of exactly ${activeOrder?.amount + activeOrder?.fee} on Revolut to @{activeOrder?.recipient_id}, then verify the transaction on DeRamp.
          Transferring more than ${activeOrder?.amount + activeOrder?.fee} could result in a loss of funds.
        </Typography>
        <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => redirectToRevolutPayment(activeOrder)}>
          Go to Revolut
        </Button>
      </Stack>
    )
  }

  function AddJomoCopilotBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Typography variant="h3" sx={{ marginTop: 2 }}>Add Jomo Copilot</Typography>
        <Typography textAlign={"center"} sx={{ marginY: 2 }}>
          Jomo Copilot on Firefox is required to verify peer-to-peer transfers on apps like Revolut
          and Venmo to then send you crypto on-chain. Jomo uses cryptography so that your user data is not read or stored any where.
        </Typography>
        <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }}>
          Add Jomo Copilot on Firefox
        </Button>
      </Stack>
    )
  }

  useEffect(() => {
    setActiveOrder(JSON.parse(localStorage.getItem('active_onramp_order')))
  }, [setActiveOrder])

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 2, marginY: 4, padding: 1 }}>
      <OrderDisplay useGrayBackground={true} />

      <VerticalLinearStepper
        sx={{
          textAlign: "left",
          maxWidth: "450px",
          minWidth: "300px",
          marginTop: "20px",
        }}
        steps={STEPS.stepIds}
        parentActiveStep={activeStep}
        renderStepLabel={renderStepLabel}
        renderStepContent={renderStepContent}
        showReset={true}
        renderResetContent={renderResetContent}
      />

      {activeStep === 0 &&
        <Button variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => setBottomSheet("pendingSendFiat")}>
          Send with Revolut
        </Button>
      }
      {activeStep === 1 &&
        <Button variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => { setBottomSheet("addExtension") }}>
          Verify with Jomo-Copilot
        </Button>
      }

      {bottomSheet === "pendingSendFiat" && <SendWithRevolutBottomsheet />}
      {bottomSheet === "confirmingTransfer" && <ConfirmTransferBottomsheet />}
      {bottomSheet === "addExtension" && <AddJomoCopilotBottomsheet />}
    </Stack >
  )
}