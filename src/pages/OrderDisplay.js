import { useUserContext } from '../context/UserContext.tsx';
import { useEffect } from 'react';

export default function OrderDisplay({ useGrayBackground = false }) {

  const { amount, setAmount } = useUserContext()

  const componentClass = `rounded-2xl p-4 ${useGrayBackground ? 'bg-gray-300' : 'bg-white'}`;

  useEffect(() => {
    setAmount(localStorage.getItem('amount'))
  }, [setAmount])

  return (
    <div className={componentClass}>
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

      <div class="h-[1px] bg-gray-500 w-full my-8"></div>

      <div className='flex flex-row justify-between'>
        <p className='text-lg'>Rate</p>
        <p className='text-lg'>1 USDC = $1.00</p>
      </div>

      <div className='flex flex-row justify-between mt-8'>
        <p className='text-lg'>Fee</p>
        <p className='text-lg'>$0.05</p>
      </div>

      <div className='flex flex-row justify-between mt-8'>
        <p className='text-lg font-bold'>Total cost</p>
        <p className='text-lg'>${parseInt(amount) + 0.05}</p>
      </div>
    </div>
  )
}