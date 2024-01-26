import { useUserContext } from '../context/UserContext.tsx';
import OrderDisplay from "./OrderDisplay"
import { useNavigate } from 'react-router-dom';
import { Stack, Button } from '@mui/material';
import * as apis from '../utils/apirequests'

export default function ReviewOrder() {

  const navigate = useNavigate();

  const { amount, setActiveOrder } = useUserContext()

  const lockOrder = async function (amount) {
    const lockResponse = await apis.backendRequest('orders/buy/create', {
      buy_amount: parseFloat(amount)
    })

    console.log(lockResponse)
    if (lockResponse.buy_order_id) {
      // TODO: extract info from response
      const order_id = lockResponse.buy_order_id
      const p2p_platform = "revolut"
      const recipient_id = "yuchennlxy"
      const tx_code = "123456"

      setActiveOrder({
        amount: amount,
        order_id: order_id,
        p2p_platform: p2p_platform,
        recipient_id: recipient_id,
        tx_code: tx_code,
      })

      navigate("/lock")
    } else {
      // TODO: insert some error messages
    }
  }

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 2, marginY: 4 }}>
      <OrderDisplay />

      <Button variant="contained" sx={{ borderRadius: 4, minWidth: "100%", marginTop: 4 }} onClick={() => lockOrder(amount)}>
        Continue
      </Button>
    </Stack>
  )
}