import { createContext, useContext } from "react"

export type UserContent = {
  user: any
  setUser: (user: any) => void
  amount: number
  setAmount: (amount: number) => void
  platform: string
  setPlatform: (platform: string) => void
  activeOrder: any
  setActiveOrder: (activeOrder: any) => void
}

// default value
export const UserContext = createContext<UserContent>({
  user: null,
  setUser: () => { },
  amount: 0,
  setAmount: () => { },
  platform: "",
  setPlatform: () => { },
  activeOrder: null,
  setActiveOrder: () => { },
});

export const useUserContext = () => useContext(UserContext)