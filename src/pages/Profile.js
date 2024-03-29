import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button, IconButton } from '@mui/material';
import { ethers } from 'ethers'
import Iconify from '../components/iconify/Iconify.tsx';
import * as apis from '../utils/apirequests'

const usdcAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",

  // Approve
  "function approve(address _spender, uint256 _value) returns (bool)",
];
const usdcAddress = process.env.REACT_APP_USDC_ADDRESS

const derampAbi = [
  "function offramp(string paymentProcessor, string ppId, uint256 amount, address _receiver) nonpayable returns ()",
]
const derampVaultAddress = process.env.REACT_APP_DERAMP_ADDRESS

export default function Profile() {
  const { ready, authenticated, zeroDevReady, logout, getAccessToken, getEthereumProvider, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();
  const isFirstMount = useRef(true)

  const [balance, setBalance] = useState(null)
  const walletAddress = useRef(null)

  const offRamp = async function (amount) {
    if (!walletAddress.current) return

    const erc20 = new ethers.Contract(usdcAddress, usdcAbi);
    const approveUSDC = await erc20.populateTransaction.approve(derampVaultAddress, BigInt(amount * 1e6));
    await sendTransaction(approveUSDC)

    console.log("approved")

    const derampVault = new ethers.Contract(derampVaultAddress, derampAbi);
    const offramp = await derampVault.populateTransaction.offramp("revolut", "yuchennlxy", BigInt(amount * 1e6), walletAddress.current);
    await sendTransaction(offramp)
    console.log("offramped")
  }

  useEffect(() => {
    if (ready && authenticated && zeroDevReady) {
      getAccessToken().then((token) => {
        localStorage.setItem("access_token", token)

        apis.backendRequest(
          'auth/check',
          {},
          {
            Authorization: "Bearer " + token
          },
        ).then(([requestStatus, _]) => {
          console.log(requestStatus)
          if (requestStatus === 401) {
            navigate('/logout')
            return
          }
        })
      })

      if (isFirstMount.current) {
        isFirstMount.current = false
        getEthereumProvider().getAddress().then((address) => {
          localStorage.setItem("wallet_address", address)
          walletAddress.current = address
          const provider = new ethers.providers.JsonRpcProvider("https://arb-mainnet.g.alchemy.com/v2/tK12GftbZkdgJnTwaDYeTBkjOgXrTGWK");
          const erc20 = new ethers.Contract(usdcAddress, usdcAbi, provider);
          erc20.balanceOf(address).then((amount) => {
            console.log("balance", parseFloat(amount) / 1e6)
            setBalance(parseFloat(amount) / 1e6)
          })
        })
      }
    } else if (ready && (!authenticated)) {
      logout()
      navigate('/')
    }
  }, [ready, authenticated, zeroDevReady])

  return (
    <Stack justifyContent="flex-start" alignItems="center" sx={{ minHeight: "100vh", marginX: 4 }}>
      <Typography variant="subtitle2" mt={2}>My Crypto</Typography>
      <Typography variant="h2" sx={{ marginTop: 3, marginBottom: 3 }}>${(balance !== null && balance.toFixed(2)) || "--.--"}</Typography>

      <Stack flexDirection="row" justifyContent={"space-between"} alignItems={"center"} width={1}>
        <Button color="primary" variant="contained" sx={{ borderRadius: 4, width: 0.4, minWidth: "110px" }} onClick={() => navigate("/onramp")}>
          Get Crypto
        </Button>
        <Button color="primary" disabled={true} variant="contained" sx={{ borderRadius: 4, width: 0.4, minWidth: "105px" }} onClick={() => { }}>
          Cash Out
        </Button>
        <IconButton sx={{ padding: 0 }} onClick={() => { navigate('/send') }}>
          <Iconify height={40} width={40} color={"primary.main"} icon="mdi:send-circle" />
        </IconButton>
      </Stack>

      <Stack sx={{ minWidth: "100%", marginTop: 4 }} flexDirection="row" alignItems={"center"}>
        <img
          src="/images/USDC.png"
          alt="USDC"
          width={48}
          height={48}
        />
        <Stack flexGrow={1} sx={{ marginLeft: 2 }}>
          <Typography variant="h6">USDC</Typography >
          <Typography>{(balance !== null && balance.toFixed(2)) || "--.--"} USDC</Typography>
        </Stack>
        <Typography variant="h6">${(balance !== null && balance.toFixed(2)) || "--.--"}</Typography>
      </Stack>
    </Stack >
  );
}