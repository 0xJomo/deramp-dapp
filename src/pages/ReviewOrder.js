import OrderDisplay from "./OrderDisplay"
import { useNavigate } from 'react-router-dom';
import { Stack, Button } from '@mui/material';

export default function ReviewOrder() {

  const navigate = useNavigate();

  return (
    <Stack sx={{ minHeight: "100vh", marginX: 2, marginY: 4 }}>
      <OrderDisplay />

      <Button variant="contained" sx={{ borderRadius: 4, minWidth: "100%", marginTop: 4 }} onClick={() => navigate("/lock")}>
        Continue
      </Button>
    </Stack>
  )
}