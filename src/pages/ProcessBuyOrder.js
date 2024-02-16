import OrderDisplay from "./OrderDisplay.js"
import { useUserContext } from '../context/UserContext.tsx';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Link, CircularProgress, Box } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import VerticalLinearStepper from "../components/stepper/VerticalLinearStepper.tsx";
import Iconify from '../components/iconify/Iconify.tsx';
import { JomoTlsnNotary } from 'jomo-tlsn-sdk/dist';
import * as apis from '../utils/apirequests'
import QRCode from "react-qr-code";

export default function ProcessBuyOrder() {

  const { activeOrder, setActiveOrder } = useUserContext()
  const [bottomSheet, setBottomSheet] = useState("")
  const [activeStep, setActiveStep] = useState(0);
  const accessToken = useRef(null)
  const isFirstMount = useRef(true)

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
        description: `Please send the exact amount to the correct recipient.`,
      },
      'verify_revolut_paymennt': {
        stepIdx: 1,
        label: 'Verify Revolut transfer',
        description:
          <Stack gap={2}>
            <Typography variant="body1">Jomo Co-pilot add-on is required to verify Revolut transfers. <Link color={"#000"} target="_blank" href={`https://chrome.google.com/webstore/detail/${extensionName}/${extensionId}`}>Install now</Link></Typography>
            <Typography variant="body1">Sign in Revolut on the tab poping up and we will help you with the verification.</Typography>
          </Stack>
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
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Confirm transfer</Typography>
          <Typography textAlign={"center"}>
            Please confirm that you have completed your transfer of <b>exactly ${activeOrder?.amount + activeOrder?.fee}</b> on Revolut to <b>@{activeOrder?.recipient_id}</b>.
          </Typography>
          <Typography textAlign={"center"}>
            <b>Transferring more than ${activeOrder?.amount + activeOrder?.fee} could result in a loss of funds.</b>
          </Typography>
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6 }} onClick={confirmTransferComplete}>
            I have completed my transfer
          </Button>
          <Button variant="text" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => setBottomSheet("pendingSendFiat")}>
            Return to make the transfer
          </Button>
        </Stack>
      </Stack >
    )
  }

  async function redirectToRevolutPayment(order) {
    window.open(`https://revolut.me/${order.recipient_id}`, "_blank")
    setBottomSheet("confirmingTransfer")
  }

  function SendWithRevolutBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Send with Revolut</Typography>
          <Typography textAlign={"center"}>
            Please complete your transfer of <b>exactly ${activeOrder?.amount + activeOrder?.fee}</b> on Revolut to <b>@{activeOrder?.recipient_id}</b>, then verify the transaction on DeRamp.
          </Typography>
          <Typography textAlign={"center"}>
            <b>Transferring more than ${activeOrder?.amount + activeOrder?.fee} could result in a loss of funds.</b>
          </Typography>
          <QRCode size={120} value={`https://revolut.me/${activeOrder.recipient_id}`} />
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6 }} onClick={() => redirectToRevolutPayment(activeOrder)}>
            Go to Revolut
          </Button>
          <Button variant="text" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={confirmTransferComplete}>
            I have completed the transfer in Revolut app
          </Button>
        </Stack>
      </Stack>
    )
  }

  function AddJomoCopilotBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Add Jomo Copilot</Typography>
          <Typography textAlign={"center"}>
            Jomo Copilot extension is required to verify peer-to-peer transfers on apps like Revolut
            and Venmo to then send you crypto on-chain. Jomo uses cryptography so that your user data is not read or stored any where.
          </Typography>
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => {
            window.open(`https://chrome.google.com/webstore/detail/${extensionName}/${extensionId}`, '_blank');
            setBottomSheet("extensionAdded")
          }}>
            Install Jomo Copilot extension
          </Button>
        </Stack>
      </Stack>
    )
  }

  function JomoCopilotAddedBottomsheet() {
    return (
      <>
        {bottomSheet === "extensionAdded" &&
          <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
            <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
              <Typography variant="h4" sx={{ marginTop: 2 }}>Jomo Copilot Added!</Typography>
              <Iconify height={72} width={72} color={"primary.main"} icon="icon-park-solid:check-one" />
              <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => { setBottomSheet("") }}>
                Continue
              </Button>
            </Stack>
          </Stack>
        }
      </>
    )
  }

  function VerifyingBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Verifying...</Typography>
          <CircularProgress size={72} color="primary" />
          <Typography textAlign={"center"} mb={2}>
            Hold on to your potatoes! This should only take less than a minute...
          </Typography>
        </Stack>
      </Stack>
    )
  }

  function VerifiedBottomsheet() {
    return (
      <>
        {activeStep === 1 &&
          <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
            <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
              <Typography variant="h4" sx={{ marginTop: 2 }}>Verification complete!</Typography>
              <Iconify height={72} width={72} color={"primary.main"} icon="icon-park-solid:check-one" />
              <Typography textAlign={"center"}>
                We verified that you've completed a transfer of ${activeOrder?.amount + activeOrder?.fee} to @{activeOrder?.recipient_id} on Revolut
              </Typography>
              <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => { setActiveStep(2) }}>
                Done
              </Button>
            </Stack>
          </Stack>
        }
      </>
    )
  }

  function SendingCryptoBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Transaction Pending</Typography>
          <CircularProgress size={72} color="primary" />
          <Typography textAlign={"center"}>
            Your transaction is pending, you will receive ${activeOrder?.amount} of USDC on DeRamp shortly. Typically this can take up to a minute.
          </Typography>
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => { setBottomSheet("") }}>
            Done
          </Button>
        </Stack>
      </Stack>
    )
  }

  function SentCryptoBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>You got crypto!</Typography>
          <Iconify height={72} width={72} color={"success.main"} icon="icon-park-solid:check-one" />
          <Typography textAlign={"center"}>
            You received ${activeOrder?.amount} of USDC.
          </Typography>
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => { window.location.href = "/profile" }}>
            View Balance
          </Button>
        </Stack>
      </Stack>
    )
  }

  function childExtensionNotFound() {
    return (
      <Button fullWidth color="secondary" variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => { setBottomSheet("addExtension") }}>
        Verify with Jomo-Copilot
      </Button>
    )
  }

  function childExtensionInstalled() {
    return JomoCopilotAddedBottomsheet()
  }

  function childExtensionFound() {
    return (
      <Button fullWidth color="secondary" variant="contained" sx={{ borderRadius: 6, marginTop: 4 }}>
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
    const [requestStatus, verifyResponse] = await apis.backendRequest(
      'orders/buy/verify',
      {
        buy_order_id: activeOrder.order_id,
        session_proof: res.session_proof,
        substrings_proof: res.substrings_proof,
        body_start: res.body_start,
        receiver_address: localStorage.getItem("wallet_address"),
        amount: activeOrder.amount,
        fee: activeOrder.fee,
      },
      {
        Authorization: "Bearer " + accessToken.current
      },
    )
    console.log(requestStatus, verifyResponse)
    if (requestStatus === 401) {
      window.location.href = '/logout'
      return
    }
    if (verifyResponse.success) {
      const newActiveOrder = {
        completed: true,
        ...activeOrder,
      }
      setActiveOrder(newActiveOrder)
      localStorage.setItem("active_onramp_order", JSON.stringify(newActiveOrder))
    }
    console.log("Check transaction status")
    setTimeout(onTransactionComplete, 5000)
  }

  const onTransactionComplete = async function () {
    console.log("transaction complete")
    setBottomSheet("cryptoTransferComplete")
  }

  useEffect(() => {
    if (!activeOrder) {
      const storedOrder = JSON.parse(localStorage.getItem('active_onramp_order'))
      if (storedOrder.completed) {
        navigate('/onramp')
        return
      }
      setActiveOrder(storedOrder)
    } else if (activeOrder.completed) {
      navigate('/onramp')
    }
  }, [setActiveOrder])

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false

      const storedAccessToken = localStorage.getItem("access_token")
      if (!storedAccessToken) {
        navigate('/logout')
        return
      }
      accessToken.current = storedAccessToken

      apis.backendRequest(
        'auth/check',
        {},
        {
          Authorization: "Bearer " + accessToken.current
        },
      ).then(([requestStatus, _]) => {
        console.log(requestStatus)
        if (requestStatus === 401) {
          navigate('/logout')
          return
        }
      })
    }
  }, [])

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 4, marginY: 4 }} gap={2} alignItems={"center"}>
      <OrderDisplay useGrayBackground={true} collapsable={true} />

      <Stack width={0.95} alignItems={"center"}>
        <Typography>
          Complete your order by transferring ${activeOrder?.amount + activeOrder?.fee} on Revolut then verify the transaction on DeRamp.
        </Typography>

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

        <ClickAwayListener onClickAway={() => {
          if (bottomSheet !== "" && bottomSheet !== "cryptoTransferComplete") setBottomSheet("")
        }}>
          <Box width={1} maxWidth={"450px"}>
            {activeStep === 0 &&
              <Button fullWidth color="secondary" variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => setBottomSheet("pendingSendFiat")}>
                Send with Revolut
              </Button>
            }
            {activeStep === 1 &&
              <JomoTlsnNotary
                notaryServers={{
                  notaryServerHost: process.env.REACT_APP_NOTARY_SERVER,
                  notaryServerSsl: process.env.REACT_APP_NOTARY_SSL === "ssl",
                  websockifyServer: process.env.REACT_APP_WEBSOCKIFY_SERVER,
                }}
                // extensionId="hebchjefjhiinmhpkcgcadmmhhfcljed"
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
              <Button fullWidth color="secondary" variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => setBottomSheet("pendingSendCrypto")}>
                Transaction Pending
              </Button>
            }
            {bottomSheet &&
              <Box>
                {bottomSheet === "pendingSendFiat" && <SendWithRevolutBottomsheet />}
                {bottomSheet === "confirmingTransfer" && <ConfirmTransferBottomsheet />}
                {bottomSheet === "addExtension" && <AddJomoCopilotBottomsheet />}
                {bottomSheet === "pendingSendCrypto" && <SendingCryptoBottomsheet />}
                {bottomSheet === "cryptoTransferComplete" && <SentCryptoBottomsheet />}
              </Box>
            }
          </Box>
        </ClickAwayListener>
      </Stack>
    </Stack >
  )
}