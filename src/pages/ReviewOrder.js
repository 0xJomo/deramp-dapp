import { useUserContext } from '../context/UserContext.tsx';
import OrderDisplay from "./OrderDisplay"
import { useNavigate } from 'react-router-dom';
import { Stack, Button } from '@mui/material';
import * as apis from '../utils/apirequests'

export default function ReviewOrder() {

  const navigate = useNavigate();

  const { amount, platform, activeOrder, setActiveOrder } = useUserContext()

  const processOrder = async function (amount, platform) {
    if (activeOrder && activeOrder.amount === amount && activeOrder.p2p_platform === platform) {
      navigate('/buy')
      return
    }
    const storedOrder = localStorage.getItem("active_onramp_order")
    if (storedOrder) {
      const decodedOrder = JSON.parse(storedOrder)
      console.log(decodedOrder, amount, platform)
      if (decodedOrder.amount === amount && decodedOrder.p2p_platform === platform) {
        setActiveOrder(decodedOrder)
        navigate('/buy')
        return
      }
    }

    lockOrder(amount, platform)
  }

  const lockOrder = async function (amount) {
    const lockResponse = await apis.backendRequest(
      'orders/buy/create',
      {
        buy_amount: parseFloat(amount)
      },
      {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      },
    )

    console.log(lockResponse)
    if (lockResponse.buy_order_id) {
      // TODO: extract info from response
      const order_id = lockResponse.buy_order_id
      const p2p_platform = "revolut"
      const recipient_id = "yuchennlxy"
      const fee = 0.05

      const order = {
        amount: parseFloat(amount),
        fee: fee,
        order_id: order_id,
        p2p_platform: p2p_platform,
        recipient_id: recipient_id,
      }
      setActiveOrder(order)
      localStorage.setItem("active_onramp_order", JSON.stringify(order))

      navigate("/buy")
    } else {
      // TODO: insert some error messages
    }
  }

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 2, marginY: 4 }}>
      <OrderDisplay />

      <Button variant="contained" sx={{ borderRadius: 4, minWidth: "100%", marginTop: 4 }} onClick={() => processOrder(amount, platform)}>
        Continue
      </Button>
    </Stack>
  )
}