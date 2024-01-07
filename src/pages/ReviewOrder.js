import OrderDisplay from "./OrderDisplay"
import { useNavigate } from 'react-router-dom';

export default function ReviewOrder() {

  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col mx-8 my-16">
      <OrderDisplay />

      <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full mt-16" onClick={() => navigate("/lock")}>
        Continue
      </button>
    </main>
  )
}