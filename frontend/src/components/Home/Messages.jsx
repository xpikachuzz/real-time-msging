

const messages = [
  {
    id: 1,
    senderId: "user123",
    senderName: "jubbbbra",
    content: "Hey, how's it going?",
    timestamp: "2025-02-18T10:00:00Z",
    type: "text"
  },
  {
    id: 2,
    senderId: "user456",
    senderName: "Alice",
    content: "I'm good! How about you?",
    timestamp: "2025-02-18T10:01:00Z",
    type: "text"
  },
  {
    id: 3,
    senderId: "user123",
    senderName: "Rudra",
    content: "I just finished a new project in React!",
    timestamp: "2025-02-18T10:02:00Z",
    type: "text"
  },
  {
    id: 4,
    senderId: "user456",
    senderName: "Alice",
    content: "That's awesome! What's it about?",
    timestamp: "2025-02-18T10:03:00Z",
    type: "text"
  },
  {
    id: 5,
    senderId: "user123",
    senderName: "Rudra",
    content: "It's a real-time messaging app with WebSockets.",
    timestamp: "2025-02-18T10:04:00Z",
    type: "text"
  },
  {
    id: 6,
    senderId: "user456",
    senderName: "Alice",
    content: "That sounds really cool! I'd love to try it out.",
    timestamp: "2025-02-18T10:05:00Z",
    type: "text"
  },
  {
    id: 7,
    senderId: "user123",
    senderName: "jubbbbra",
    content: "Hey, how's it going?",
    timestamp: "2025-02-18T10:00:00Z",
    type: "text"
  },
  {
    id: 8,
    senderId: "user456",
    senderName: "Alice",
    content: "I'm good! How about you?",
    timestamp: "2025-02-18T10:01:00Z",
    type: "text"
  },
  {
    id: 9,
    senderId: "user123",
    senderName: "Rudra",
    content: "I just finished a new project in React!",
    timestamp: "2025-02-18T10:02:00Z",
    type: "text"
  },
  {
    id: 10,
    senderId: "user456",
    senderName: "Alice",
    content: "That's awesome! What's it about?",
    timestamp: "2025-02-18T10:03:00Z",
    type: "text"
  },
  {
    id: 11,
    senderId: "user123",
    senderName: "Rudra",
    content: "It's a real-time messaging app with WebSockets.",
    timestamp: "2025-02-18T10:04:00Z",
    type: "text"
  },
  {
    id: 12,
    senderId: "user456",
    senderName: "Alice",
    content: "That sounds really cool! I'd love to try it out.",
    timestamp: "2025-02-18T10:05:00Z",
    type: "text"
  },
  {
    id: 13,
    senderId: "user123",
    senderName: "jubbbbra",
    content: "Hey, how's it going?",
    timestamp: "2025-02-18T10:00:00Z",
    type: "text"
  },
  {
    id: 14,
    senderId: "user456",
    senderName: "Alice",
    content: "I'm good! How about you?",
    timestamp: "2025-02-18T10:01:00Z",
    type: "text"
  },
  {
    id: 15,
    senderId: "user123",
    senderName: "Rudra",
    content: "I just finished a new project in React!",
    timestamp: "2025-02-18T10:02:00Z",
    type: "text"
  },
  {
    id: 16,
    senderId: "user456",
    senderName: "Alice",
    content: "That's awesome! What's it about?",
    timestamp: "2025-02-18T10:03:00Z",
    type: "text"
  },
  {
    id: 17,
    senderId: "user123",
    senderName: "Rudra",
    content: "It's a real-time messaging app with WebSockets.",
    timestamp: "2025-02-18T10:04:00Z",
    type: "text"
  },
  {
    id: 18,
    senderId: "user456",
    senderName: "Alice",
    content: "That sounds really cool! I'd love to try it out.",
    timestamp: "2025-02-18T10:05:00Z",
    type: "text"
  }
];




export const Messages = ({chosen, setChosen}) => {
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
      <div className="flex flex-col gap-3 h-11/12 overflow-y-scroll">
        {messages.map((msg) => (
          <div className={`w-full px-10 ${msg.senderName === "Rudra" ? "flex flex-row-reverse" : "flex flex-row"}`} key={msg.id}>
            <div className={`border-2 bg-blue-400  border-blue-500 px-6 py-3 rounded-3xl  ${msg.senderName === "Rudra" ? "rounded-br-none" : "rounded-bl-none" }`}>
              <div className="flex flex-col pb-2">
                <h1 className="text-orange-400">{msg.senderName}</h1>
              </div>
              <p className="">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
