import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';

export default function Profile() {
  const { login, logout, ready, authenticated, user, zeroDevReady, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-12">
      <h1 className='mt-24 mb-8'>$100.00</h1>

      <div className="flex flex-row min-w-full">
        <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-28 mr-4" onClick={() => navigate("/onramp")}>
          Get Crypto
        </button>
        <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-28">
          Cash Out
        </button>
      </div>

      <div className="flex flex-row min-w-full mt-8 items-center">
        <img
          src="/images/USDC.png"
          alt="USDC"
          className='w-12 h-12 mr-4'
        />
        <div className="flex flex-col grow">
          <h6>USDC</h6>
          <p>100.00 USDC</p>
        </div>
        <h6>$100.00</h6>
      </div>
    </main >
  );
}