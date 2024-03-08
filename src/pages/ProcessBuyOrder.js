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

  const isFirefox = typeof InstallTrigger !== 'undefined';
  const isChrome = !!window.chrome;

  const navigate = useNavigate();

  const p2pAppServer = {
    "revolut": "app.revolut.com",
    "venmo": "account.venmo.com",
  }[activeOrder?.p2p_platform]
  const extensionId = "nmdnfckjjghlbjeodefnapacfnocpdgm"
  const extensionName = "jomo-copilot"

  const getPlatformDisplay = (platform) => {
    if (platform === "revolut") return "Revolut"
    if (platform === "venmo") return "Venmo"
  }

  const getPlatformPaymentLink = (platform, recipient) => {
    if (platform === "revolut") {
      return `https://revolut.me/${recipient}`
    }
    if (platform === "venmo") {
      return `https://venmo.com/u/${recipient}`
    }
  }

  const STEPS = {
    stepIds: ['send_p2p_payment', 'verify_p2p_paymennt', 'receive_usdc'],
    stepDetails: {
      'send_p2p_payment': {
        stepIdx: 0,
        label: `Send $${activeOrder?.amount + activeOrder?.fee} on ${getPlatformDisplay(activeOrder?.p2p_platform)} to @${activeOrder?.recipient_id}`,
        description: `Please send the exact amount to the correct recipient.`,
      },
      'verify_p2p_paymennt': {
        stepIdx: 1,
        label: `Verify ${getPlatformDisplay(activeOrder?.p2p_platform)} transfer`,
        description:
          <Stack gap={2}>
            {isChrome &&
              <Typography variant="body1">Jomo Co-pilot extension is required to verify {getPlatformDisplay(activeOrder?.p2p_platform)} transfers. <Link color={"#000"} target="_blank" href={`https://chrome.google.com/webstore/detail/${extensionName}/${extensionId}`}>Install now</Link></Typography>
            }
            {isFirefox &&
              <Typography variant="body1">Jomo Co-pilot add-on is required to verify {getPlatformDisplay(activeOrder?.p2p_platform)} transfers. <Link color={"#000"} target="_blank" href={`https://addons.mozilla.org/en-US/firefox/addon/jomo-copilot/`}>Install now</Link></Typography>
            }
            <Typography variant="body1">Sign in {getPlatformDisplay(activeOrder?.p2p_platform)} on the tab poping up and we will help you with the verification.</Typography>
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
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Confirm transfer</Typography>
          <Typography textAlign={"center"}>
            Please confirm that you have completed your transfer of <b>exactly ${activeOrder?.amount + activeOrder?.fee}</b> on {getPlatformDisplay(activeOrder?.p2p_platform)} to <b>@{activeOrder?.recipient_id}</b>.
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

  async function redirectToP2pPayment(order) {
    window.open(getPlatformPaymentLink(order.p2p_platform, order.recipient_id), "_blank")
    setBottomSheet("confirmingTransfer")
  }

  function SendWithP2pBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Send with {getPlatformDisplay(activeOrder?.p2p_platform)}</Typography>
          <Typography textAlign={"center"}>
            Please complete your transfer of <b>exactly ${activeOrder?.amount + activeOrder?.fee}</b> on {getPlatformDisplay(activeOrder?.p2p_platform)} to <b>@{activeOrder?.recipient_id}</b>, then verify the transaction on DeRamp.
          </Typography>
          <Typography textAlign={"center"}>
            <b>Transferring more than ${activeOrder?.amount + activeOrder?.fee} could result in a loss of funds.</b>
          </Typography>
          <QRCode size={120} value={getPlatformPaymentLink(activeOrder?.p2p_platform, activeOrder?.recipient_id)} />
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6 }} onClick={() => redirectToP2pPayment(activeOrder)}>
            Go to {getPlatformDisplay(activeOrder?.p2p_platform)}
          </Button>
          <Button variant="text" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={confirmTransferComplete}>
            I have completed the transfer in {getPlatformDisplay(activeOrder?.p2p_platform)} app
          </Button>
        </Stack>
      </Stack>
    )
  }

  function AddJomoCopilotBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Add Jomo Copilot</Typography>
          <Typography textAlign={"center"}>
            Jomo Copilot extension is required to verify peer-to-peer transfers on apps like Revolut
            and Venmo to then send you crypto on-chain. Jomo uses cryptography so that your user data is not read or stored any where.
          </Typography>
          {isChrome &&
            <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => {
              window.open(`https://chrome.google.com/webstore/detail/${extensionName}/${extensionId}`, '_blank');
              setBottomSheet("extensionAdded")
            }}>
              Install Jomo Copilot extension
            </Button>
          }
          {isFirefox &&
            <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => {
              window.open(`https://addons.mozilla.org/en-US/firefox/addon/jomo-copilot/`, '_blank');
              setBottomSheet("extensionAdded")
            }}>
              Install Jomo Copilot addon
            </Button>
          }
        </Stack>
      </Stack>
    )
  }

  function JomoCopilotAddedBottomsheet() {
    return (
      <>
        {bottomSheet === "extensionAdded" &&
          <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
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
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
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
          <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
            <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
              <Typography variant="h4" sx={{ marginTop: 2 }}>Verification complete!</Typography>
              <Iconify height={72} width={72} color={"primary.main"} icon="icon-park-solid:check-one" />
              <Typography textAlign={"center"}>
                We verified that you've completed a transfer of ${activeOrder?.amount + activeOrder?.fee} to @{activeOrder?.recipient_id} on {getPlatformDisplay(activeOrder?.p2p_platform)}
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
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
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
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
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

  function VerifyFailedBottomsheet() {
    return (
      <Stack alignItems="center" sx={{ zIndex: 800, position: "fixed", left: 0, right: 0, bottom: 0, background: "#ECECEC", padding: 2, borderRadius: "16px 16px 0 0" }}>
        <Stack maxWidth={"550px"} alignItems={"center"} gap={2}>
          <Typography variant="h4" sx={{ marginTop: 2 }}>Failed to verify</Typography>
          <Iconify height={72} width={72} color={"error.main"} icon="radix-icons:cross-1" />
          <Typography textAlign={"center"}>
            We were unable to verify your transfer.
          </Typography>
          <Button color="secondary" variant="contained" sx={{ minWidth: "80%", borderRadius: 6, marginBottom: 2 }} onClick={() => {
            setBottomSheet("")
            setActiveStep(0)
          }}>
            Done
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
        Sign-in to {getPlatformDisplay(activeOrder?.p2p_platform)} to verify
      </Button>
    )
  }

  function childVerificationInProgress() {
    return VerifyingBottomsheet()
  }

  function childVerificationFail() {
    return VerifyFailedBottomsheet()
  }

  const buildAuthHeadersRevolut = function (response) {
    const cookie = response.headers["Cookie"]
    const deviceId = response.headers["x-device-id"]
    const userAgent = response.headers["User-Agent"]

    const authedHeader = new Map([
      ["Cookie", cookie],
      ["X-Device-Id", deviceId],
      ["User-Agent", userAgent],
      ["Host", p2pAppServer],
    ])
    return authedHeader
  }

  const buildDataPathWithResponseRevolut = function (response) {
    const account = response["pockets"][0]["id"] || null
    if (!account) {
      return null
    }
    const dataPath = `api/retail/user/current/transactions/last?count=1&internalPocketId=${account}`
    return dataPath
  }

  const buildAuthHeadersVenmo = function (response) {
    const cookie = response.headers["Cookie"]

    const authedHeader = new Map([
      ["Cookie", cookie],
      ["Host", p2pAppServer],
    ])
    return authedHeader
  }

  const buildDataPathWithResponseVenmo = function (response) {
    var myId = ""
    var otherId = ""

    for (const story of response["stories"]) {
      if (story.audience !== "private") continue
      if (story.title.receiver.username === activeOrder.recipient_id) {
        otherId = story.title.receiver.id
        myId = story.title.sender.id
        break
      }
    }

    if (!myId || !otherId) {
      return null
    }
    const dataPath = `api/stories?feedType=betweenYou&otherUserId=${otherId}&externalId=${myId}`
    return dataPath
  }

  const onNotarizationResult = async function (res) {
    setBottomSheet("verificationInProgress")
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

      setBottomSheet("verificationSuccess")

      console.log("Check transaction status")
      setTimeout(onTransactionComplete, 5000)
    } else {
      console.log("Failed to verify", verifyResponse.reason)
      setBottomSheet("verificationFailed")
    }
  }

  const onNotarizationError = async function (e) {
    console.log(e)
    setBottomSheet("verificationFailed")
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
          Complete your order by transferring ${activeOrder?.amount + activeOrder?.fee} on {getPlatformDisplay(activeOrder?.p2p_platform)} then verify the transaction on DeRamp.
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
          if (bottomSheet !== ""
            && bottomSheet !== "cryptoTransferComplete"
            && bottomSheet !== "verificationInProgress"
            && bottomSheet !== "verificationFailed"
          ) {
            setBottomSheet("")
          }
        }}>
          <Box width={1} maxWidth={"450px"}>
            {activeStep === 0 &&
              <Button fullWidth color="secondary" variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => setBottomSheet("pendingSendFiat")}>
                Send with {getPlatformDisplay(activeOrder?.p2p_platform)}
              </Button>
            }
            {activeStep === 1 && activeOrder?.p2p_platform === "revolut" &&
              <JomoTlsnNotary
                notaryServers={{
                  notaryServerHost: process.env.REACT_APP_NOTARY_SERVER,
                  notaryServerSsl: process.env.REACT_APP_NOTARY_SSL === "ssl",
                  websockifyServer: process.env.REACT_APP_WEBSOCKIFY_SERVER_REVOLUT,
                }}
                // extensionId="hebchjefjhiinmhpkcgcadmmhhfcljed"
                extensionConfigs={{
                  redirectUrl: "https://app.revolut.com/home",
                  urlFilters: ["https://app.revolut.com/api/retail/user/current/wallet"],
                }}
                applicationConfigs={{
                  appServer: p2pAppServer,
                }}
                onNotarizationResult={onNotarizationResult}
                onNotarizationError={onNotarizationError}
                defaultNotaryFlowConfigs={{
                  defaultNotaryFlow: true,
                  buildAuthHeaders: buildAuthHeadersRevolut,
                  queryPath: "api/retail/user/current/wallet",
                  queryMethod: "GET",
                  buildDataPathWithResponse: buildDataPathWithResponseRevolut,
                  dataMethod: "GET",
                  keysToNotarize: [["account"], ["amount"], ["category"], ["comment"], ["completeDate"], ["id"], ["state"], ["recipient", "id"], ["recipient", "code"], ["currency"]],
                }}
                childExtensionNotFound={childExtensionNotFound()}
                childExtensionInstalled={childExtensionInstalled()}
                childExtensionFound={childExtensionFound()}
                childVerificationInProgress={childVerificationInProgress()}
                childVerificationComplete={(<></>)}
                childVerificationFail={childVerificationFail()}
              />
            }
            {activeStep === 1 && activeOrder?.p2p_platform === "venmo" &&
              <JomoTlsnNotary
                notaryServers={{
                  notaryServerHost: process.env.REACT_APP_NOTARY_SERVER,
                  notaryServerSsl: process.env.REACT_APP_NOTARY_SSL === "ssl",
                  websockifyServer: process.env.REACT_APP_WEBSOCKIFY_SERVER_VENMO,
                }}
                // extensionId="hebchjefjhiinmhpkcgcadmmhhfcljed"
                extensionConfigs={{
                  redirectUrl: "https://account.venmo.com",
                  urlFilters: ["https://account.venmo.com/api/stories*"],
                }}
                applicationConfigs={{
                  appServer: p2pAppServer,
                }}
                onNotarizationResult={onNotarizationResult}
                onNotarizationError={onNotarizationError}
                defaultNotaryFlowConfigs={{
                  defaultNotaryFlow: true,
                  buildAuthHeaders: buildAuthHeadersVenmo,
                  queryPath: `api/stories?feedType=friend`,
                  queryMethod: "GET",
                  buildDataPathWithResponse: buildDataPathWithResponseVenmo,
                  dataMethod: "GET",
                  keysToNotarize: [["stories", "amount"], ["stories", "date"], ["stories", "id"], ["stories", "type"], ["stories", "title"]],
                }}
                childExtensionNotFound={childExtensionNotFound()}
                childExtensionInstalled={childExtensionInstalled()}
                childExtensionFound={childExtensionFound()}
                childVerificationInProgress={childVerificationInProgress()}
                childVerificationComplete={(<></>)}
                childVerificationFail={childVerificationFail()}
              />
            }
            {activeStep === 2 && bottomSheet !== "cryptoTransferComplete" &&
              <Button fullWidth color="secondary" variant="contained" sx={{ borderRadius: 6, marginTop: 4 }} onClick={() => {
                if (bottomSheet !== "cryptoTransferComplete") setBottomSheet("pendingSendCrypto")
              }}>
                Transaction Pending
              </Button>
            }
            {bottomSheet &&
              <Box>
                {bottomSheet === "pendingSendFiat" && <SendWithP2pBottomsheet />}
                {bottomSheet === "confirmingTransfer" && <ConfirmTransferBottomsheet />}
                {bottomSheet === "addExtension" && <AddJomoCopilotBottomsheet />}
                {bottomSheet === "verificationInProgress" && <VerifyingBottomsheet />}
                {bottomSheet === "verificationSuccess" && <VerifiedBottomsheet />}
                {bottomSheet === "pendingSendCrypto" && <SendingCryptoBottomsheet />}
                {bottomSheet === "cryptoTransferComplete" && <SentCryptoBottomsheet />}
                {bottomSheet === "verificationFailed" && <VerifyFailedBottomsheet />}
              </Box>
            }
          </Box>
        </ClickAwayListener>
      </Stack>
    </Stack >
  )
}