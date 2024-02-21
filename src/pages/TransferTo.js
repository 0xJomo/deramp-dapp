import { useState, useRef, useEffect } from 'react';
import OrderDisplay from "./OrderDisplay"
import { usePrivySmartAccount } from '@zerodev/privy';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Typography, Input, Divider, CircularProgress } from '@mui/material';
import { ethers } from 'ethers'
import * as apis from '../utils/apirequests'
import Iconify from '../components/iconify/Iconify.tsx';

const usdcAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",

  // Approve
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Transfer
  "function transfer(address to, uint amount) returns (bool)",
];
const usdcAddress = "0x757f842e1bd3494f3ffe495925e6c418f80c0767"

export default function TransferTo() {

  const { ready, authenticated, zeroDevReady, logout, getEthereumProvider, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();
  const isFirstMount = useRef(true)
  const chain = "Sepolia"

  const [receiver, setReceiver] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  // receiver, amount, review, sending, completed
  const [state, setState] = useState("receiver")
  const balance = useRef(0.0)
  const [displayBalance, setBalance] = useState("--.--")
  const [txHash, setTxHash] = useState("")

  const trimToAlphaNumericValue = (e) => {
    var value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9]/g, "")
    value = value.substring(0, 42)
    setReceiver(value);
  }

  const validReceiverAddress = (receiver) => {
    return ethers.utils.isAddress(receiver)
  }

  const handleInputChangeAndAdjustWidth = (e) => {
    var value = e.target.value;
    if (value.startsWith("0")) value = ""
    if (parseFloat(value) < 1) value = ""
    if (parseFloat(value) > balance.current) value = balance.current.toString()
    const shortValue = parseFloat(value).toFixed(2)
    if (shortValue.length - value.length < 0) {
      value = value.substring(0, shortValue.length)
    }
    if (value.length === 0) {
      e.target.parentNode.style.width = '1.6rem'
    } else {
      var len = value.length * 1.6 + 0.5
      if (value.includes('.')) len -= 1.6
      e.target.parentNode.style.width = `${len}rem`
    }
    setSendAmount(value);
  }

  const confirmSendAmount = (value) => {
    if (value > balance.current) {
      setSendAmount(balance.current.toFixed(2))
    }
    else {
      setSendAmount(value)
    }
    if (!value) return
    setState("review")
  }

  const formatAddress = (address) => {
    return address.substring(0, 10) + " ...... " + address.substring(34)
  }

  const sendMoney = async (amount, receiver) => {
    setState("sending")
    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/v178sXJ0X49qRdgINzyuNbEvKsMXob4W");
    const erc20 = new ethers.Contract(usdcAddress, usdcAbi, provider);
    const transferTx = await erc20.populateTransaction.transfer(receiver, BigInt(parseFloat(amount) * 1e18))
    const txHash = await sendTransaction(transferTx)
    setTxHash(txHash)
    setState("sent")
  }

  useEffect(() => {
    if (ready && authenticated && zeroDevReady) {
      if (isFirstMount.current) {
        isFirstMount.current = false

        const storedAccessToken = localStorage.getItem("access_token")
        if (!storedAccessToken) {
          navigate('/logout')
          return
        }

        apis.backendRequest(
          'auth/check',
          {},
          {
            Authorization: "Bearer " + storedAccessToken
          },
        ).then(([requestStatus, _]) => {
          console.log(requestStatus)
          if (requestStatus === 401) {
            navigate('/logout')
            return
          }
        })

        getEthereumProvider().getAddress().then((address) => {
          const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/v178sXJ0X49qRdgINzyuNbEvKsMXob4W");
          const erc20 = new ethers.Contract(usdcAddress, usdcAbi, provider);
          erc20.balanceOf(address).then((amount) => {
            console.log("balance", parseFloat(amount) / 1e18)
            balance.current = parseFloat(amount) / 1e18
            setBalance(balance.current.toFixed(2))
          })
        })
      }
    } else if (ready && (!authenticated)) {
      logout()
      navigate('/')
    }
  }, [ready, authenticated, zeroDevReady])

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 4 }} alignItems={"center"}>
      <Typography variant="subtitle2" mt={2} mb={4}>Send</Typography>

      {state === "receiver" &&
        <Stack width={1} alignItems={"center"} gap={4} mt={16}>
          <Typography variant='h5'>Enter receiver address</Typography>
          <Input
            type="text"
            value={receiver}
            multiline
            maxRows={5}
            placeholder='0x...'
            autoFocus={true}
            disableUnderline={true}
            sx={{ fontSize: "2.5rem" }}
            onChange={trimToAlphaNumericValue}
          />
          <Button disabled={!validReceiverAddress(receiver) || displayBalance === "--.--"} variant="contained" color="secondary" sx={{ borderRadius: 10, width: 1, marginTop: 8 }} onClick={() => { setState("amount") }}>
            Continue
          </Button>
        </Stack>
      }
      {state === "amount" &&
        <Stack gap={10} alignItems="center" width={1} justifyContent={"center"} maxHeight={"600px"} mt={16}>
          <Stack alignItems={"center"}>
            <Stack flexDirection="row" alignItems="center" justifyContent="center" sx={{ marginY: 2 }}>
              <Typography variant="h2">$</Typography>
              <Input
                type="number"
                value={sendAmount}
                style={{}}
                placeholder='0'
                autoFocus={true}
                disableUnderline={true}
                sx={{ fontSize: "2.5rem", width: "1.6rem" }}
                onChange={handleInputChangeAndAdjustWidth}
              />
            </Stack>
            <Typography variant="h5">{(parseFloat(sendAmount) || 0).toFixed(2)} USDC</Typography>
            <Typography variant="body2">Max {displayBalance} USDC</Typography>
          </Stack>
          <Stack flexDirection="row" justifyContent="center" gap={4} width={"300px"}>
            <Button sx={{ borderRadius: 4, margin: 1 }} variant="contained" onClick={() => confirmSendAmount(20)}>
              $20
            </Button>
            <Button sx={{ borderRadius: 4, margin: 1 }} variant="contained" onClick={() => confirmSendAmount(50)}>
              $50
            </Button>
            <Button sx={{ borderRadius: 4, margin: 1 }} variant="contained" onClick={() => confirmSendAmount(100)}>
              $100
            </Button>
          </Stack>

          <Button color="secondary" variant="contained" sx={{ borderRadius: 10, width: "300px" }} onClick={() => confirmSendAmount(parseFloat(sendAmount))}>
            Next
          </Button>
        </Stack>
      }
      {state === "review" &&
        <Stack flexGrow={1} mb={8} sx={{ marginX: 4, width: 1 }} alignItems={"center"} justifyContent={"space-between"}>
          <Stack width={1}>
            <Stack>
              <Typography variant="h5">Send ${sendAmount} of USDC</Typography>
              <Typography>Est. {sendAmount} USDC</Typography>
            </Stack>

            <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
              <Typography>To</Typography>
              <Typography>{formatAddress(receiver)}</Typography>
            </Stack>

            <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
              <Typography>Network</Typography>
              <Typography>Sepolia</Typography>
            </Stack>

            <Divider sx={{ marginTop: 4 }} />

            <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
              <Typography>Network Fee</Typography>
              <Typography>$0.00</Typography>
            </Stack>

            <Stack flexDirection="row" justifyContent="space-between" sx={{ marginTop: 3 }} >
              <Typography variant="subtitle1">Total</Typography>
              <Typography>${sendAmount}</Typography>
            </Stack>
          </Stack>
          <Button variant="contained" color="secondary" sx={{ borderRadius: 10, width: 1, marginTop: 8 }} onClick={() => sendMoney(sendAmount, receiver)}>
            Continue
          </Button>
        </Stack>
      }
      {state === "sending" &&
        <Stack flexGrow={1} mb={8} sx={{ marginX: 4, width: 1 }} alignItems={"center"} justifyContent={"space-between"}>
          <Typography variant='h4'>Your transfer is on the way!</Typography>
          <CircularProgress size={144} color="primary" />
          <Button fullWidth disabled variant='contained'>Continue</Button>
        </Stack>
      }
      {state === "sent" &&
        <Stack flexGrow={1} mb={8} sx={{ marginX: 4, width: 1 }} alignItems={"center"} justifyContent={"space-between"}>
          <Typography variant='h4'>Your transfer is complete!</Typography>
          <Iconify height={144} width={144} color={"success.main"} icon="icon-park-solid:check-one" />
          <Stack width={1} gap={2}>
            <Button fullWidth variant='contained' onClick={() => navigate('/profile')}>Continue</Button>
            <Button fullWidth variant='text' onClick={() => {
              window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')
            }}>View Transaction</Button>
          </Stack>
        </Stack>
      }
    </Stack >
  )
}