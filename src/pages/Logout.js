import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { usePrivySmartAccount } from '@zerodev/privy';

export default function Logout() {
  const { logout } = usePrivySmartAccount();
  const navigate = useNavigate();

  useEffect(() => {
    logout()
    localStorage.removeItem("access_token")
    localStorage.removeItem("active_onramp_order")
    navigate('/')
  }, [])

  return (
    <></>
  );
}