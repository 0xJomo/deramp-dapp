import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Typography, Stack, Button } from '@mui/material';
import { ethers } from 'ethers'

const usdcAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",

  // Approve
  "function approve(address _spender, uint256 _value) returns (bool)",
];
const usdcAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const derampAbi = [
  "function offramp(string paymentProcessor, string ppId, uint256 amount, address _receiver) nonpayable returns ()",
]
const derampVaultAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

export default function Profile() {
  const { ready, authenticated, zeroDevReady, logout, getAccessToken, getEthereumProvider, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();
  const isFirstMount = useRef(true)

  const [balance, setBalance] = useState(0)
  const walletAddress = useRef(null)

  const offRamp = async function (amount) {
    if (!walletAddress.current) return

    const erc20 = new ethers.Contract(usdcAddress, usdcAbi);
    const approveUSDC = await erc20.populateTransaction.approve(derampVaultAddress, BigInt(amount * 1e18));
    await sendTransaction(approveUSDC)

    console.log("approved")

    const derampVault = new ethers.Contract(derampVaultAddress, derampAbi);
    const offramp = await derampVault.populateTransaction.offramp("revolut", "yuchennlxy", BigInt(amount * 1e18), walletAddress.current);
    await sendTransaction(offramp)
    console.log("offramped")
  }

  useEffect(() => {
    if (ready && authenticated && zeroDevReady) {
      getAccessToken().then((token) => {
        localStorage.setItem("access_token", token)
      })

      if (isFirstMount.current) {
        isFirstMount.current = false
        getEthereumProvider().getAddress().then((address) => {
          localStorage.setItem("wallet_address", address)
          walletAddress.current = address
          const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
          const erc20 = new ethers.Contract(usdcAddress, usdcAbi, provider);
          erc20.balanceOf(address).then((amount) => {
            console.log("balance", parseFloat(amount) / 1e18)
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
        <Button color="secondary" variant="contained" sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 7, marginRight: 1 }} onClick={() => offRamp(100)}>
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