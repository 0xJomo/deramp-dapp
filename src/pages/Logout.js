import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';

export default function Logout() {
  const { logout } = usePrivySmartAccount();
  const navigate = useNavigate();

  useEffect(() => {
    logout()
    navigate('/profile')
  }, [])

  return (
    <></>
  );
}