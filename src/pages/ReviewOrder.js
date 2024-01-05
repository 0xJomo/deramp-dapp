import { useUserContext } from '../context/UserContext.tsx';

export default function ReviewOrder() {

  const { amount } = useUserContext()
  console.log(amount)

  return (
    <main className="flex min-h-screen flex-col mx-8 my-16">
      <h4>Get ${amount} of USDC</h4>
      <p className='text-lg'>Est. {amount} USDC</p>

      <div className='flex flex-row justify-between mt-16'>
        <p className='text-lg'>Transfer method</p>
        <p className='text-lg'>Revolut</p>
      </div>

      <div className='flex flex-row justify-between mt-8'>
        <p className='text-lg'>Network</p>
        <p className='text-lg'>Arbitrum</p>
      </div>

      <div className='flex flex-row justify-between mt-8'>
        <p className='text-lg'>Rate</p>
        <p className='text-lg'>1 USDC = $1.00</p>
      </div>

      <div className='flex flex-row justify-between mt-8'>
        <p className='text-lg'>Fee</p>
        <p className='text-lg'>$0.05</p>
      </div>

      <div className='flex flex-row justify-between mt-8'>
        <p className='text-lg font-bold'>Total cost</p>
        <p className='text-lg'>${amount + 0.05}</p>
      </div>

      <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full mt-16">
        Continue
      </button>
    </main>
  )
}