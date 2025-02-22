const { createClient } = require("redis");


(async () => {
  const client = createClient();

  client.on("error", (err) => console.error("Redis Error:", err));

  await client.connect(); // Important: Connect to Redis first!

  await client.lPush( 
    "friends:",
    "RUBBBBRA"          // refers to the friendname
  )
  const currentFriendList = await client.lRange(
    "friends:",  // refers to the hashmap we are accessing
    0, -1     // the range of the stack we are accessing
  )

  console.log(currentFriendList)


  // // Set a string key-value pair
  // await client.set("string key", "string val");

  // // Set hash values using HSET
  // await client.hSet("hash key", "hashtest 1", "some value");
  // await client.hSet("hash key", "hashtest 2", "some other value");

  // // Retrieve hash keys
  // const replies = await client.hKeys("hash key");
  // console.log(replies.length + " replies:");
  // replies.forEach((reply, i) => console.log(`    ${i}: ${reply}`));

  // Disconnect from Redis
  await client.quit();
})();