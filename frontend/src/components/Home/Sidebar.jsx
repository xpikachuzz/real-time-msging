import React, { useContext } from 'react'
import { FriendContext } from '../../context/FriendContext'


const data = [
  "rudra",
  "bassi",
  "bassi2",
  "bassi3",
  "bas4si",
  "bass7i",
  "ba7s5si",
  "bas43si",
]

export const Sidebar = ({chosen, setChosen, setAddFriendForm}) => {
  const {friendList} = useContext(FriendContext)

  return (
    <div className='flex flex-col items-center px-3'>
      <div className='justify-evenly gap-4 flex pt-4 w-full'>
        <h1 className='text-xl font-semibold text-white text-center my-2 py-2 w-fit '>Add Friend</h1>
        <button onClick={() => setAddFriendForm(true)} className='text-lg font-semibold text-white text-center my-auto rounded-xl bg-blue-600 px-2 border-2 border-blue-500 w-fit hover:cursor-pointer hover:border-blue-400 hover:bg-blue-700'>👤</button>
      </div>
      <hr className="dashed text-gray-800 w-11/12 mx-4 mb-8" />

      {friendList.map((row, i) => {console.log("row: ", row); return (
          <button onClick={() => setChosen(row.username)} key={i} className={`text-2xl rounded-xl flex justify-start gap-4 items-center font-semibold text-left w-full px-6 pt-1 pb-2 mb-3 bg-blue-100/50 ${row===chosen ? "bg-blue-200/50": ""}`}>
            <div className='rounded-full bg-green-500 w-6 h-6 mt-1'></div>
            <h1 className={`${row.username===chosen ? "font-bold": ""}`}>{row.connected}</h1>
            <h1 className={`${row.username===chosen ? "font-bold": ""}`}>{row.username}</h1>
            <h1 className={`${row.username===chosen ? "font-bold": ""}`}>{row.userId}</h1>
          </button>
        )}
      )}
    </div>
  )
}
