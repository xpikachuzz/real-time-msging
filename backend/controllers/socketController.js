const redisClient = require("../redis")



module.exports.authorizeUser = async (socket, next) => {
  // redisClient.FLUSHALL()
  console.log(socket.request.session)
  console.log(socket.request.session.user)
  try {
    if (!socket.request.session || !socket.request.session.user) {
      console.log("BAD REQUEST (authorizeUser)")
      // Errors emit "connect_error" type, which is listed to by the frontend
      next(new Error("Not authorized"))
    } else {
      socket.user = {
        ...socket.request.session.user
      }
      // goes into redis db and creates a js object
      // 1st argument is the key to the hashmap (like db)
      // 2nd & 3rd argument: key and value pair
      await redisClient.hSet("userid:"+socket.user.username, "userId", String(socket.user.userId))
      next()
    }
  } catch (e) {
    console.log("Redis Errror: ", e)
  }
}

module.exports.initializeUser = async socket => {
  socket.user = { ...socket.request.session.user };

  // creates a room/channel for the user
  socket.join(socket.user.userId)
  await redisClient.hSet(
    "userid:"+socket.user.username,
    // Show connected
    'connected',
    'true'
  );
  await redisClient.hSet(
    `userid:${socket.user.username}`,
    "userId",
    socket.user.userId,
  );



  // Get friends
  const friendList = await redisClient.lRange(
    `friends:${socket.user.username}`,
    0,
    -1
  );


  const parseFList = await parseFriendList(friendList)
  const friendRooms = parseFList.map(friend => friend.userId)

  // emit to all afriends that we are online now
  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit(
      "connected", 
      'true', 
      socket.user.username
    )
  }

  // send to frontend
  socket.emit("friends", parseFList);

  // fetch the messages in the format of to.from.content
  const messageQuery = await redisClient.lRange("chat:"+socket.user.userId, 0, -1)

  // to.from.content
  const messages = messageQuery.map(msg => {
    const [to, from, content] = msg.split(".")
    return {to, from, content}
  })

  if (messages && messages.length > 0) socket.emit("messages", messages)
};


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
    ].join(".")
  )

  const newFriend = {
    username: friendName,
    userId: friend.userId,
    connected: friend.connected
  }
  cb({done: true, newFriend})
}


module.exports.onDisconnect = async (socket) => {
  // on logout you show disconnected
  await redisClient.hSet(
    "userid:"+socket.user.username, 
    "connected", 
    'false'
  )

  // get friends
  const friendList = await redisClient.lRange(
    "friends:"+socket.user.username, 
    0,
    -1
  )


  const friendRooms = await parseFriendList(friendList).then(friends => friends.map(friend => friend.userId))

  // emit to all afriends that we are offline now
  socket.to(friendRooms).emit("connected", 'false', socket.user.username)
}


module.exports.dm = async (socket, message) => {
  // add the user's id
  message.from = socket.user.userId
  
  // format it will be stored in: to.fron.content
  const messageString = [
    message.to, 
    message.from, 
    message.content
  ].join(".")

  // stack of messages, will be stored of the sender and reciever like this:
  await redisClient.lPush("chat:"+message.to, messageString)
  await redisClient.lPush("chat:"+message.from, messageString)

  // the other is identified by their userId which 
  // is stored in the `to` and `from`
  socket.to(message.to).emit("dm", message)
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