import OrderDisplay from "./OrderDisplay.js"
import { useUserContext } from '../context/UserContext.tsx';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Link, CircularProgress } from '@mui/material';
import VerticalLinearStepper from "../components/stepper/VerticalLinearStepper.tsx";
import Iconify from '../components/iconify/Iconify.tsx';
import { JomoTlsnNotary } from 'jomo-tlsn-sdk/dist';
import * as apis from '../utils/apirequests'

export default function ProcessBuyOrder() {

  const { activeOrder, setActiveOrder } = useUserContext()
  // reviewOrder, pendingSendFiat, pendingVerifyTransfer, addCopilot, pendingVerifyWithCopilot, verifying, verified, received
  const [bottomSheet, setBottomSheet] = useState("")
  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate();

  const revolutServer = "app.revolut.com"
  const extensionId = "nmdnfckjjghlbjeodefnapacfnocpdgm"
  const extensionName = "jomo-copilot"

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
        description: <Typography variant="body1">Jomo Co-pilot add-on is required to verify Revolut transfers. <Link color={"#000"} target="_blank" href={`https://chrome.google.com/webstore/detail/${extensionName}/${extensionId}`}>Install now</Link></Typography>,
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

    return description
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
          Jomo Copilot on Firefox is required to verify pe er-to-peer transfers on apps like Revolut
          and Venmo to then send you crypto on-chain. Jomo uses cryptography so that your user data is not read or stored any where.
        </Typography>
        <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => {
          window.open(`https://chrome.google.com/webstore/detail/${extensionName}/${extensionId}`, '_blank');
          setBottomSheet("extensionAdded")
        }}>
          Add Jomo Copilot on Firefox
        </Button>
      </Stack>
    )
  }

  function JomoCopilotAddedBottomsheet() {
    return (
      <>
        {bottomSheet === "extensionAdded" &&
          <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
            <Typography variant="h3" sx={{ marginTop: 2 }}>Jomo Copilot Added!</Typography>
            <Iconify height={36} width={36} color={"success.main"} icon="material-symbols:check" />
            <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => { setBottomSheet("") }}>
              Continue
            </Button>
          </Stack>
        }
      </>
    )
  }

  function VerifyingBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Typography variant="h3" sx={{ marginTop: 2 }}>Verifiying...</Typography>
        <CircularProgress size={24} color="primary" />
        <Typography textAlign={"center"} sx={{ marginY: 2 }}>
          Hold on to your potatoes! This should only take less than a minute...
        </Typography>
      </Stack>
    )
  }

  function VerifiedBottomsheet() {
    return (
      <>
        {activeStep === 1 &&
          <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
            <Typography variant="h3" sx={{ marginTop: 2 }}>Verification complete!</Typography>
            <Iconify height={36} width={36} color={"success.main"} icon="material-symbols:check" />
            <Typography textAlign={"center"} sx={{ marginY: 2 }}>
              We verified that you've completed a transfer of ${activeOrder?.amount + activeOrder?.fee} to @{activeOrder?.recipient_id} on Revolut
            </Typography>
            <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => { setActiveStep(2) }}>
              Done
            </Button>
          </Stack>
        }
      </>
    )
  }

  function SendingCryptoBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Typography variant="h3" sx={{ marginTop: 2 }}>Transaction Pending</Typography>
        <CircularProgress size={24} color="primary" />
        <Typography textAlign={"center"} sx={{ marginY: 2 }}>
          Your transaction is pending, ou will receive ${activeOrder?.amount} of USDC on DeRamp shortly. Typically this can take up to a minute.
        </Typography>
        <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => { setBottomSheet("") }}>
          Done
        </Button>
      </Stack>
    )
  }

  function SentCryptoBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "lightgrey", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Typography variant="h3" sx={{ marginTop: 2 }}>You got crypto!</Typography>
        <Iconify height={36} width={36} color={"success.main"} icon="material-symbols:check" />
        <Typography textAlign={"center"} sx={{ marginY: 2 }}>
          You received ${activeOrder?.amount} of USDC.
        </Typography>
        <Button variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 6 }} onClick={() => { navigate("/profile") }}>
          View Balance
        </Button>
      </Stack>
    )
  }

  function childExtensionNotFound() {
    return (
      <Button variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => { setBottomSheet("addExtension") }}>
        Verify with Jomo-Copilot
      </Button>
    )
  }

  function childExtensionInstalled() {
    return JomoCopilotAddedBottomsheet()
  }

  function childExtensionFound() {
    return (
      <Button variant="contained" sx={{ borderRadius: 6, marginTop: 4 }}>
        Sign-in to Revolut to verify
      </Button>
    )
  }

  function childVerificationInProgress() {
    return VerifyingBottomsheet()
  }

  function childVerificationComplete() {
    return VerifiedBottomsheet()
  }

  function childVerificationFail() {
    return (
      <Typography variant="body1">Failed to fetch data</Typography>
    )
  }

  const buildAuthHeaders = function (response) {
    const cookie = response.headers["Cookie"]
    const deviceId = response.headers["x-device-id"]
    const userAgent = response.headers["User-Agent"]

    const authedHeader = new Map([
      ["Cookie", cookie],
      ["X-Device-Id", deviceId],
      ["User-Agent", userAgent],
      ["Host", revolutServer],
    ])
    return authedHeader
  }

  const buildDataPathWithResponse = function (response) {
    const account = response["pockets"][0]["id"] || null
    if (!account) {
      return null
    }
    const dataPath = `api/retail/user/current/transactions/last?count=1&internalPocketId=${account}`
    return dataPath
  }

  const onNotarizationResult = async function (res) {
    console.log(res)
    console.log("send proof to backend to initiate transfer")
    const verifyResponse = await apis.backendRequest('orders/buy/verify', {
      buy_order_id: activeOrder.order_id,
      session_proof: res.session_proof,
      substrings_proof: res.substrings_proof,
      body_start: res.body_start,
    })
    console.log(verifyResponse)
    console.log("Check transaction status")
    setTimeout(onTransactionComplete, 5000)
  }

  const onTransactionComplete = async function () {
    console.log("transaction complete")
    setBottomSheet("cryptoTransferComplete")
  }

  useEffect(() => {
    if (!activeOrder) {
      setActiveOrder(JSON.parse(localStorage.getItem('active_onramp_order')))
    }
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
        <JomoTlsnNotary
          notaryServers={{
            notaryServerHost: "127.0.0.1:7047",
            notaryServerSsl: false,
            websockifyServer: "ws://127.0.0.1:61289",
          }}
          // extensionId="c4c27de5-8322-4044-a30f-af2ec4f7b6fb"
          // extensionName="deramp-mobile"
          extensionConfigs={{
            redirectUrl: "https://app.revolut.com/home",
            urlFilters: ["https://app.revolut.com/api/retail/user/current/wallet"],
          }}
          applicationConfigs={{
            appServer: revolutServer,
          }}
          onNotarizationResult={onNotarizationResult}
          defaultNotaryFlowConfigs={{
            defaultNotaryFlow: true,
            buildAuthHeaders: buildAuthHeaders,
            queryPath: "api/retail/user/current/wallet",
            queryMethod: "GET",
            buildDataPathWithResponse: buildDataPathWithResponse,
            dataMethod: "GET",
            keysToNotarize: [["account"], ["amount"], ["category"], ["comment"], ["completeDate"], ["id"], ["state"], ["recipient", "id"], ["recipient", "code"], ["currency"]],
          }}
          childExtensionNotFound={childExtensionNotFound()}
          childExtensionInstalled={childExtensionInstalled()}
          childExtensionFound={childExtensionFound()}
          childVerificationInProgress={childVerificationInProgress()}
          childVerificationComplete={childVerificationComplete()}
          childVerificationFail={childVerificationFail()}
        />
      }
      {activeStep === 2 &&
        <Button variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => setBottomSheet("pendingSendCrypto")}>
          Transaction Pending
        </Button>
      }

      {bottomSheet === "pendingSendFiat" && <SendWithRevolutBottomsheet />}
      {bottomSheet === "confirmingTransfer" && <ConfirmTransferBottomsheet />}
      {bottomSheet === "addExtension" && <AddJomoCopilotBottomsheet />}
      {bottomSheet === "pendingSendCrypto" && <SendingCryptoBottomsheet />}
      {bottomSheet === "cryptoTransferComplete" && <SentCryptoBottomsheet />}
    </Stack >
  )
}