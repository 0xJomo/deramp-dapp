import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';

export default function Home() {
  const { login, logout, ready, authenticated, user, zeroDevReady, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();

  if (ready && authenticated) {
    // navigate('/onramp')
  }

  if (zeroDevReady) {
    console.log(user)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly px-12">
      <h1>DeRamp</h1>

      <div className="flex flex-col min-w-full">
        <button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full" onClick={login}>
          Get Crypto
        </button>
        {ready && authenticated && <p className="text-center mt-4" onClick={logout}>
          Log out
        </p>}
      </div>
    </main >
  );
}