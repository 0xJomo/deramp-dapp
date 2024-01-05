import { createContext, useContext } from "react"

export type UserContent = {
  user: any
  setUser: (user: any) => void
  amount: number
  setAmount: (page: number) => void
}

// default value
export const UserContext = createContext<UserContent>({
  user: null,
  setUser: () => { },
  amount: 0,
  setAmount: () => { },
});

export const useUserContext = () => useContext(UserContext)