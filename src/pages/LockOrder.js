import OrderDisplay from "./OrderDisplay"
import { useUserContext } from '../context/UserContext.tsx';
import { useState, useEffect } from "react";
import { Button } from '@mui/material';

function ConfirmTransferBottomsheet() {
  return (
    <div className="flex flex-col items-center fixed inset-x-0 bottom-0 p-4 bg-white shadow-lg">
      <h2 className="mb-4">Confirm transfer</h2>
      <p className="text-center">Please complete your transfer of exactly $100.05 on Revolut to @arthaud, then
        verify the transaction on DeRamp. Transferring more than $100.05 could result in a loss of funds.
      </p>
      <Button>
        I have completed my transfer
      </Button>
      <p className="my-4">
        Return to Revolut to complete my transfer
      </p>
    </div>
  )
}

function SendWithRevolutBottomsheet() {
  return (
    <div className="flex flex-col items-center fixed inset-x-0 bottom-0 p-4 bg-white shadow-lg">
      <h2 className="mb-4">Send with Revolut</h2>
      <p className="text-center">Please complete your transfer of exactly $100.05 on Revolut to @arthaud, then verify the transaction on DeRamp.
        Transferring more than $100.05 could result in a loss of funds.
      </p>
      <Button>
        Go to Revolut
      </Button>
    </div>
  )
}

function AddJomoCopilotBottomsheet() {
  return (
    <div className="flex flex-col items-center fixed inset-x-0 bottom-0 p-4 bg-white shadow-lg">
      <h2 className="mb-4">Add Jomo Copilot</h2>
      <p className="text-center">Jomo Copilot on Firefox is required to verify peer-to-peer transfers on apps like Revolut
        and Venmo to then send you crypto on-chain. Jomo uses cryptography so that your user data is not read or stored any where.
      </p>
      <Button>
        I have completed my transfer
      </Button>
      <p className="my-4">
        Add Jomo Copilot on Firefox
      </p>
    </div>
  )
}

export default function LockOrder() {

  const { amount } = useUserContext()
  // reviewOrder, pendingSendFiat, pendingVerifyTransfer, addCopilot, pendingVerifyWithCopilot, verifying, verified, received
  const [orderStatus, setOrderStatus] = useState("reviewOrder")

  return (
    <main className="flex min-h-screen flex-col mx-8 my-16">
      <OrderDisplay useGrayBackground={true} />

      <div className="mt-8">
        <p className="font-bold mb-8">Complete your transfer on Revolut</p>

        <div className="flex flex-row justify-left items-center mb-8">
          <div class="w-10 h-10 bg-gray-500 rounded-full mr-4"></div>
          <p className="font-bold">Send ${amount} on Revolut</p>
        </div>

        <div className="flex flex-row justify-left items-center mb-8">
          <div class="w-10 h-10 border-2 border-gray-500 rounded-full mr-4"></div>
          <p className="font-bold">Verify Revolut transfer</p>
        </div>

        <div className="flex flex-row justify-left items-center mb-8">
          <div class="w-10 h-10 border-2 border-gray-500 rounded-full mr-4"></div>
          <p className="font-bold">Receive ${amount} of USDC on DeRamp</p>
        </div>
      </div>

      <Button onClick={() => setOrderStatus("pendingSendFiat")}>
        Send with Revolut
      </Button>

      {orderStatus === "pendingSendFiat" && <SendWithRevolutBottomsheet />}
    </main>
  )
}