import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button } from '@mui/material';
import { ethers } from 'ethers'

const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
];
const usdcAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export default function Profile() {
  const { ready, authenticated, zeroDevReady, logout, getAccessToken, getEthereumProvider } = usePrivySmartAccount();
  const navigate = useNavigate();
  const isFirstMount = useRef(true)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (ready && authenticated && zeroDevReady) {
      if (isFirstMount.current) {
        isFirstMount.current = false
        getAccessToken().then((token) => {
          localStorage.setItem("access_token", token)
        })
        getEthereumProvider().getAddress().then((address) => {
          localStorage.setItem("wallet_address", address)
          const provider = new ethers.JsonRpcProvider("http://localhost:8545");
          const erc20 = new ethers.Contract(usdcAddress, abi, provider);
          erc20.balanceOf(address).then((amount) => {
            setBalance(parseFloat(amount) / 1e18)
          })
        })
      }
    } else if (ready && (!authenticated)) {
      logout()
      navigate('/')
    }
  }, [ready, authenticated, zeroDevReady])

  return (
    <Stack justifyContent="flex-start" alignItems="center" sx={{ minHeight: "100vh", paddingX: 3 }}>
      <Typography variant="h2" sx={{ marginTop: 6, marginBottom: 2 }}>${balance.toFixed(2)}</Typography>

      <Stack flexDirection="row">
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }} onClick={() => navigate("/onramp")}>
          Get Crypto
        </Button>
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }}>
          Cash Out
        </Button>
      </Stack>

      <Stack sx={{ minWidth: "100%", marginTop: 4 }} flexDirection="row">
        <img
          src="/images/USDC.png"
          alt="USDC"
          width={48}
          height={48}
        />
        <Stack flexGrow={1} sx={{ marginLeft: 1 }}>
          <Typography variant="h6">USDC</Typography >
          <Typography>{balance.toFixed(2)} USDC</Typography>
        </Stack>
        <Typography variant="h6">${balance.toFixed(2)}</Typography>
      </Stack>
    </Stack >
  );
}