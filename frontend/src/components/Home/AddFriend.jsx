import { useContext, useRef, useState } from "react"
import socket from "../../socket"
import TextField from "../Login&Signup/TextField"
import { FriendContext } from "../../context/FriendContext"

export const AddFriend = ({setAddFriendForm, chosen}) => {
  const friendRef = useRef()
  const [errMsg, setErrMsg] = useState()
  const {setFriendList} = useContext(FriendContext)

  function submitHandler(e) {
    e.preventDefault()

    // `emit` to trigger an event in the backend socket server
    // 1st argument: event name
    // >1 arguments: data
    socket.emit("add_friend", friendRef.current.value, ({errorMsg, done, newFriend}) => {
      if (done) {
        setAddFriendForm(false)
        setErrMsg(null)
        setFriendList(c => [newFriend, ...c])
      } else {
        setErrMsg(errorMsg)
      }
    })
  }

  return (
    <div className="fixed bg-gray-300/70 top-0 left-0 right-0 bottom-0">
      <div className="absolute left-1/2 top-1/2 -translate-1/2 bg-blue-500 w-1/3 px-6 py-2 pb-6 rounded-xl">
        
        {/* Header */}
        <div className="flex justify-between py-3">
          <h1 className="font-bold text-slate-800 text-2xl">Add a Friend!</h1>
          <button onClick={() => setAddFriendForm(false)} className="flex items-center justify-center h-full">
            <div  className="hover:cursor-pointer px-1">
              ❌
            </div>
          </button>
        </div>
        {/* Form */}
        <form>
          {/* Text Field */}
          <div>
            <TextField
              prompt={"Enter Username"}
              name={"username"}
              inputProps={{
                  placeholder: "Username",
                  ref: friendRef
              }}
            />
          </div>
          
          {/* Error Message */}
          {errMsg && (
            <h1 className="text-lg font-semibold text-center text-red-500 mb-3">{errMsg}</h1>
          )}
          {/* Submit button */}
          <div className="flex justify-end">
            <button onClick={submitHandler} className="mt-3 bg-blue-300 px-6 py-2 rounded-xl border-2 border-blue-400 hover:cursor-pointer hover:bg-blue-400 hover:border-black">Add Friend</button>
          </div>
        </form>
      </div>
    </div>
  )
}
