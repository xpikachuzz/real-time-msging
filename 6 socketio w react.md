# To use socketIO with reactjs
Install: `npm i socket.io-client`


```js
// socket.js
import {io} from "socket.io-client"

// 1st arg is backend url.
const socket = new io("http://localhost:3000", {
  // to connect manually only
  autoConnect: false,
  // Send frontend cookies to client
  withCredentials: true
})

export default socket


// useSocketSetup
export const useSocketSetup = () => {
  const {setUser} = useContext(AccountContext)
  
  useEffect(() => {
    socket.connect()
    socket.on("connect_error", () => {
      // logout if connection failed
      setUser({loggedIn: false})
    })
    
    // when you do `socket.on` you create an event listener 
    // which you should clean up later. So run `socket.off` 
    // when useEffect stops finishes
    return () => {
      socket.off("connect_error")
    }
  }, [])
}


export default useSocketSetup
```


# Warning: the cors' `credentials` may need to be boolean or string.

