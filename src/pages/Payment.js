import { useUserContext } from '../context/UserContext.tsx';

export default function Payment() {

  const { amount } = useUserContext()

  console.log(amount)

  return (
    <main className="flex min-h-screen flex-col mx-8 my-16">
      <h4>
        Choose a peer-to-peer transfer method
      </h4>

      <button className="my-8 bg-gray-500 rounded-2xl p-4">
        <div className="flex flex-row items-center">
          <img
            src="/images/revolut.png"
            alt="revolut"
          />
          <div className="flex flex-col items-start mx-4">
            <h3 className="text-l font-bold">Revolut</h3>
            <h6 className="text-xs">No additional KYC, transfer directly P2P</h6>
          </div>
        </div>
      </button>
    </main>
  )
}