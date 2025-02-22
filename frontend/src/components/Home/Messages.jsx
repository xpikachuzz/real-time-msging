import { useContext, useEffect, useRef } from "react";
import { MessagesContext } from "../../context/MessagesContext";
import { ChatBox } from "./ChatBox";
import { FriendContext } from "../../context/FriendContext";


export const Messages = ({chosen, setChosen}) => {
  const {messages} = useContext(MessagesContext)
  const {friendList} = useContext(FriendContext)
  const userId = friendList.filter(friend => friend.username === chosen)[0].userId
  const bottomDiv = useRef(null)


  useEffect(() => {
    bottomDiv.current?.scrollIntoView()
  }, [messages])
  
  return (
    <div className='items-center pb-10 h-screen relative'>
      <div className="header w-full h-1/12">
        <div className='justify-evenly gap-4 flex pt-4 w-full'>
          <h1 className='text-xl font-semibold text-white text-center my-2 py-2 w-fit '>
            {chosen}
          </h1>
        </div>
        <hr className="dashed text-gray-800 w-11/12 mx-4 mb-8" />
      </div>
      <div className="flex flex-col-reverse overflow-x-clip gap-3 h-11/12 overflow-y-scroll">
        <div ref={bottomDiv}></div>
        {messages
          .filter(msg => msg.to === userId || msg.from === userId)
          .map((msg, idx) => (
            <div className={`w-full text-wrap break-all px-10 ${msg.from !== userId ? "flex flex-row-reverse" : "flex flex-row"}`} key={`msg:${chosen}.${idx}`}>
              <div className={`border-2 max-w-8/12  bg-blue-400  border-blue-500 px-6 py-3 rounded-3xl  ${msg.from !== userId ? "rounded-br-none" : "rounded-bl-none" }`}>
                <div className="flex flex-col pb-2">
                  <h1 className="text-orange-400">{msg.senderName}</h1>
                </div>
                <p className="w-full">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
      </div>
      <ChatBox userId={userId} />
    </div>
  )
}
