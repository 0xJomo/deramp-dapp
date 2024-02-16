import { useUserContext } from '../context/UserContext.tsx';
import OrderDisplay from "./OrderDisplay"
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Typography } from '@mui/material';
import * as apis from '../utils/apirequests'

export default function ReviewOrder() {

  const navigate = useNavigate();

  const { amount, platform, activeOrder, setActiveOrder } = useUserContext()

  const processOrder = async function (amount, platform) {
    if (activeOrder && activeOrder.amount === amount && activeOrder.p2p_platform === platform && !activeOrder.completed) {
      window.location.href = '/buy'
      return
    }
    const storedOrder = localStorage.getItem("active_onramp_order")
    if (storedOrder) {
      const decodedOrder = JSON.parse(storedOrder)
      console.log(decodedOrder, amount, platform)
      if (decodedOrder.amount === amount && decodedOrder.p2p_platform === platform && !decodedOrder.completed) {
        setActiveOrder(decodedOrder)
        window.location.href = '/buy'
        return
      }
    }

    lockOrder(amount, platform)
  }

  const lockOrder = async function (amount) {
    const [requestStatus, lockResponse] = await apis.backendRequest(
      'orders/buy/create',
      {
        buy_amount: parseFloat(amount)
      },
      {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      },
    )

    if (requestStatus === 401) {
      navigate('/logout')
      return
    }
    console.log(lockResponse)
    if (lockResponse && lockResponse.buy_order_id) {
      // TODO: extract info from response
      const order_id = lockResponse.buy_order_id
      const p2p_platform = "revolut"
      const recipient_id = "yuchennlxy"
      const fee = 0

      const order = {
        amount: parseFloat(amount),
        fee: fee,
        order_id: order_id,
        p2p_platform: p2p_platform,
        recipient_id: recipient_id,
      }
      setActiveOrder(order)
      localStorage.setItem("active_onramp_order", JSON.stringify(order))

      window.location.href = '/buy'
    } else {
      // TODO: insert some error messages
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