import OrderDisplay from "./OrderDisplay"
import { useUserContext } from '../context/UserContext.tsx';

function ConfirmTransferBottomsheet() {
  return (
    <div className="flex flex-col items-center fixed inset-x-0 bottom-0 p-4 bg-white shadow-lg">
      <h2>Confirm transfer</h2>
      <p className="text-center">Please complete your transfer of exactly $100.05 on Revolut to @arthaud, then
        verify the transaction on DeRamp. Transferring more than $100.05 could result in a loss of funds.
      </p>
      <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full mt-8">
        I have completed my transfer
      </button>
      <p className="my-4">
        Return to Revolut to complete my transfer
      </p>
    </div>
  )
}

export default function LockOrder() {

  const { amount } = useUserContext()

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

      <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full mt-16">
        Send with Revolut
      </button>

      <ConfirmTransferBottomsheet />
    </main>
  )
}