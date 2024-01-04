import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly px-12">

      <div className="flex flex-col items-center justify-between">
        <h1 className="text-5xl font-extrabold my-8">$0</h1>
        <h3 className="text-xl font-bold">0.00 USDC</h3>
      </div>

      <div className="flex flex-row items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4">
          $20
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4">
          $50
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4">
          $100
        </button>
      </div>

      <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full">
        <Link to="/payment">
          Next
        </Link>
      </button>
    </main>
  );
}