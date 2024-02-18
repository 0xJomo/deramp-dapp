import { useUserContext } from '../context/UserContext.tsx';
import OrderDisplay from "./OrderDisplay"
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Typography } from '@mui/material';
import * as apis from '../utils/apirequests'

export default function ReviewOrder() {

  const navigate = useNavigate();

  const { amount, platform, activeOrder, setActiveOrder } = useUserContext()

  const chain = "Sepolia"

  const processOrder = async function (amount, platform) {
    if (activeOrder
      && activeOrder.amount === amount
      && activeOrder.p2p_platform === platform
      && activeOrder.chain === chain
      && !activeOrder.completed
    ) {
      window.location.href = '/buy'
      return
    }
    const storedOrder = localStorage.getItem("active_onramp_order")
    if (storedOrder) {
      const decodedOrder = JSON.parse(storedOrder)
      if (decodedOrder.amount === amount
        && decodedOrder.p2p_platform === platform
        && decodedOrder.chain === chain
        && !decodedOrder.completed
      ) {
        setActiveOrder(decodedOrder)
        window.location.href = '/buy'
        return
      }
    }

    lockOrder(amount, platform)
  }

  const lockOrder = async function (amount, platform) {
    const [requestStatus, lockResponse] = await apis.backendRequest(
      'orders/buy/create',
      {
        buy_amount: parseFloat(amount),
        p2p_platform: platform,
        chain: chain
      },
      {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      },
    )

    if (requestStatus === 401) {
      navigate('/logout')
      return
    }
    if (lockResponse && lockResponse.buy_order_id) {
      const order_id = lockResponse.buy_order_id
      const recipient_id = lockResponse.recipient_id
      const fee = 0

      const order = {
        amount: parseFloat(amount),
        fee: fee,
        order_id: order_id,
        p2p_platform: platform,
        recipient_id: recipient_id,
        chain: chain,
      }
      setActiveOrder(order)
      localStorage.setItem("active_onramp_order", JSON.stringify(order))

      window.location.href = '/buy'
    } else {
      console.log(lockResponse)
    }
  }

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 4 }} alignItems={"center"}>
      <Typography variant="subtitle2" mt={2} mb={4}>Review order</Typography>

      <OrderDisplay />

      <Button variant="contained" color="secondary" sx={{ borderRadius: 10, width: 1, marginTop: 8 }} onClick={() => processOrder(amount, platform)}>
        Continue
      </Button>
    </Stack>
  )
}