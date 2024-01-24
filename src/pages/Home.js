import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';
import { Button } from '@mui/base/Button';

export default function Home() {
  const { login, logout, ready, authenticated, user, zeroDevReady, sendTransaction } = usePrivySmartAccount();
  const navigate = useNavigate();

  if (ready && authenticated && zeroDevReady) {
    console.log(user)
    navigate("/profile")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly px-12">
      <h1>DeRamp</h1>

      <div className="flex flex-col min-w-full">
        <Button className="bg-purple-500 h-12 hover:bg-purple-700 text-white font-bold rounded-3xl min-w-full" onClick={login}>
          Get Crypto
        </Button>
        {ready && authenticated && <p className="text-center mt-4" onClick={logout}>
          Log out
        </p>}
      </div>
    </main >
  );
}