import React, { useContext, useEffect } from 'react'
import socket from './../../socket';
import { AccountContext } from './../../context/AccountContext';
import { useNavigate } from 'react-router-dom';

export const useSocketSetup = (setFriendList) => {
  const {user, setUser} = useContext(AccountContext)

  useEffect(() => {
    socket.connect()
    socket.on("friends", friendList => setFriendList(friendList))
    socket.on("connect_error", (e) => {
      // logout if connection failed
      setUser({loggedIn: false})
      console.log("ERROR: ", e, user)
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
    }
  }, [])
}


export default useSocketSetup