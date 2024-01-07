import { useNavigate } from 'react-router-dom';

export default function Payment() {

  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col mx-8 my-16">
      <p>
        Choose a peer-to-peer transfer method
      </p>

      <button className="my-8 bg-gray-500 rounded-2xl p-4" onClick={() => navigate("/review")}>
        <div className="flex flex-row items-center">
          <img
            src="/images/revolut.png"
            alt="revolut"
          />
          <div className="flex flex-col items-start mx-4">
            <p className="text-l font-bold">Revolut</p>
            <p className="text-xs">No additional KYC, transfer directly P2P</p>
          </div>
        </div>
      </button>
    </main>
  )
}