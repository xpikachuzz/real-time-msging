import { useState } from "react"
import { Messages } from "../components/Home/Messages"
import { Sidebar } from "../components/Home/Sidebar"
import { AddFriend } from "../components/Home/AddFriend"
import useSocketSetup from "../components/Home/useSocketSetup"
import { FriendsContext } from "../context/FriendContext"

export const Home = () => {
  const [chosen, setChosen] = useState(null)
  const [addFriendForm, setAddFriendForm] = useState(false)
  const [messages, setMessages] = useState([])

  return (
    <FriendsContext>
      <div className="h-screen w-screen overflow-x-hidden">
        <div className="grid grid-cols-10 gap-2 bg-blue-300 h-full">
          <div className="channels col-span-3 border-r-2 border-blue-400">
            <Sidebar chosen={chosen} setChosen={setChosen} setAddFriendForm={setAddFriendForm} />
          </div>
          { !chosen ? "" : (
            <div className="col-span-7">
              <Messages messages={messages} setMessages={setMessages} chosen={chosen} setChosen={setChosen} />
            </div>
          )}
        </div>
        {addFriendForm ? <AddFriend chosen={chosen} setAddFriendForm={setAddFriendForm} /> : ""}
      </div>
    </FriendsContext>
  )
}
