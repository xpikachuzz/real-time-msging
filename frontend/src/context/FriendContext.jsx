import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useSocketSetup from "../components/Home/useSocketSetup";


export const FriendContext = createContext()


export const FriendsContext = ({children}) => {
  const [friendList, setFriendList] = useState([]);
  useSocketSetup(setFriendList)

  return <FriendContext.Provider value={{friendList, setFriendList}}>
    {children}
  </FriendContext.Provider>
}