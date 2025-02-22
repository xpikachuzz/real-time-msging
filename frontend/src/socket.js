import {io} from "socket.io-client"
import 'dotenv'


// 1st arg is backend url.
const socket = new io(import.meta.env.VITE_BACKEND_URL, {
  // to connect manually only
  autoConnect: false,
  // Send frontend cookies to client
  withCredentials: true,
})


export default socket