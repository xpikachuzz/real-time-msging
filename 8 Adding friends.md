1. submit handler:

```jsx
// AddFriend.jsx
  function submitHandler(e) {
    e.preventDefault()

    // `emit` to trigger an event in the backend socket server
    // 1st argument: event name
    // >1 arguments: data/information to send over
                           // contains freind's username
    socket.emit("add_friend", friendRef.current.value, ({errorMsg, done}) => {
      if (done) {
        setAddFriendForm(false)
      } else {
        setErrMsg(errorMsg)
      }
    })
    //
    console.log(friendRef.current.value)
  }
```

```js
// index.js
io.on("connect", (socket) => {
  // allow even listener
  // the socket contains the requester's user data.
  socket.on("add_friend", (friendName, cb) => addFriend(socket, friendName, cb))
});


// socketController.js
...
module.exports.addFriend = async (socket, friendName, cb) => {
  // socket.user refers to the user's (who requested) data
  // if you are trying ot msg yourself
  if (friendName === socket.user.username) {
    cb({done: false, errorMsg: "Cannot add self!"})
    return
  }
  const friendUserId = await redisClient.hGet(
    "userid:"+friendName, 
    "userid"
  )
  // If user doesn't exist
  if (!friendUserId) {
    cb({done: false, errorMsg: "User doesn't exist!"})
    return;
  }

  console.log("FINDING FRIEND")
  // if already in friendlist
  const currentFriendList = await redisClient.lRange(
    "friends:"+socket.user.username,  // refers to the hashmap we are accessing
    0, -1     // the range of the stack we are accessing, this means all of it
  )

  // if a list exists
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({done: false, errorMsg: "Friend already added!"});
    return
  }

  // else add it
  await redisClient.lPush( 
    "friends:"+socket.user.username,
    friendName          // refers to the friend's name
  )
  cb({done: true})
}
```

<p>
The problem right now is that the user's friends are stored in 
client and is lost when refreshed, so setup a context provider
like so:
</p>

```jsx
// FriendsContext.jsx
export const FriendContext = createContext()


export const FriendsContext = ({children}) => {
  const [friendList, setFriendList] = useState([]);
  useSocketSetup(setFriendList)

  return <FriendContext.Provider value={{friendList, setFriendList}}>
    {children}
  </FriendContext.Provider>
}


// useSocketSetup.jsx
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
    
    // when you do `socket.on` you create an event listener 
    // which you should clean up later. So run `socket.off` 
    // when useEffect stops finishes
    return () => {
      socket.off("connect_error")
    }
  }, [])
}



// AddFriend.jsx
export const AddFriend = ({setAddFriendForm, chosen}) => {
  const friendRef = useRef()
  const [errMsg, setErrMsg] = useState()
  const {setFriendList} = useContext(FriendContext)
  ...
}

// Home.jsx
export const Home = () => {
  const [chosen, setChosen] = useState(null)
  const [addFriendForm, setAddFriendForm] = useState(false)

  return (
    <FriendsContext>
      // ... Contains friends_list  & msgs
    </FriendsContext>
  )
}
```



# Online status
### Show disconnected/connected to redis

```jsx
// index.js
io.on("connect", (socket) => {
    ...
    socket.on("disconnecting", () => onDisconnect(socket));
})


// socketController.js
module.exports.onDisconnect = async (socket) => {
  // on logout you show disconnected
  await redisClient.hset(`userid:${socket.user.username}`, "connected", false)

  // get friends

  // emit to all afriends that we are offline now
}


module.exports.initializeUser = async socket => {
  ...

  // creates a room/channel for the user
  socket.join(socket.user.userId)
  await redisClient.hSet(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userId,
    // Show connected
    'connected',
    true
  );
  ...
};
```


### Friends status
```js
module.exports.addFriend = async (socket, friendName, cb) => {
  // socket.user refers to the user's (who requested) data
  // if you are trying ot msg yourself
  if (friendName === socket.user.username) {
    cb({done: false, errorMsg: "Cannot add self!"})
    return
  }
  const friend = await redisClient.hGetAll(
    "userid:"+friendName
  )
  // If user doesn't exist
  if (!friend) {
    cb({done: false, errorMsg: "User doesn't exist!"})
    return;
  }

  // if already in friendlist
  const currentFriendList = await redisClient.lRange(
    "friends:"+socket.user.username,  // refers to the hashmap we are accessing
    0, -1     // the range of the stack we are accessing, this means all of it
  )

  // if a list exists
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({done: false, errorMsg: "Friend already added!"});
    return
  }

  // else add it
  await redisClient.lPush( 
    "friends:"+socket.user.username,
    [
      friendName,
      friend.userId
    ].join(".")     // save it as a string
  )
  cb({done: true})
}



// on disconnect handling
module.exports.onDisconnect = async (socket) => {
  // on logout you show disconnected
  await redisClient.hset(`userid:${socket.user.username}`, "connected", false)

  // get friends
  const friendList = await redisClient.lRange(
    "friends:"+socket.user.username, 
    0,
    -1
  )

  // turn get all userId, unique for users and defined by redis
  const friendRooms = (await parseFriendList(friendList))
    .then(friends => friends.map(friend => friend.userId))

  // emit to all friends that we are offline now
  socket.to(friendRooms).emit(
    "connected", 
    false, 
    socket.user.username
  )
}


const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    // format is [username, userId]
    const parsedFriend = friend.split(".")
    const friendConnected = await redisClient.hGet("userid:"+parsedFriend[0], "connected")
    newFriendList.push({
      username: parsedFriend[0],
      userId: parsedFriend[1],
      connected: friendConnected
    })
  }
  return newFriendList
}

```