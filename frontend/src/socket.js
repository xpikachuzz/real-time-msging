import {io} from "socket.io-client"


// 1st arg is backend url.
const socket = new io("http://localhost:3000", {
  // to connect manually only
  autoConnect: false,
  // Send frontend cookies to client
  withCredentials: true,
})


export default socket