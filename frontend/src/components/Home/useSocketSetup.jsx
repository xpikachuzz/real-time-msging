import { useContext, useEffect } from 'react'
import socket from './../../socket';
import { AccountContext } from './../../context/AccountContext';

export const useSocketSetup = (setFriendList, setMessages) => {
  const {user, setUser} = useContext(AccountContext)

  useEffect(() => {
    socket.connect()
    socket.on("friends", friendList => setFriendList(friendList))
    socket.on("messages", messages => setMessages(messages))
    socket.on("connect_error", (e) => {
      // logout if connection failed
      setUser({loggedIn: false})
      console.log("ERROR: ", e, user)
    })
    socket.on("dm", message => {
      setMessages(prev => [message, ...prev])
    })
    socket.on("connected", (status, username) => {
      setFriendList(prevFriends => {
        return [...prevFriends].map(friend => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });
    
    // when you do `socket.on` you create an event listener 
    // which you should clean up later. So run `socket.off` 
    // when useEffect stops finishes
    return () => {
      socket.off("connect_error")
      socket.off("connected")
      socket.off("friends")
      socket.off("messages")
      socket.off("dm")
    }
  }, [setFriendList, setMessages, setUser, user])
}


export default useSocketSetup