import React from 'react'


const data = [
  "rudra",
  "bassi",
  "bassi",
  "bassi",
  "bassi",
  "bassi",
  "bassi",
  "bassi",
]

export const Sidebar = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className='justify-evenly gap-4 flex pt-4 w-full'>
        <h1 className='text-xl font-semibold text-white text-center my-2 py-2 w-fit '>Add Friend</h1>
        <button className='text-lg font-semibold text-white text-center my-auto rounded-xl bg-blue-600 px-2 border-2 border-blue-500 w-fit hover:cursor-pointer hover:border-blue-400 hover:bg-blue-700'>👤</button>
      </div>
      <hr className="dashed text-gray-800 w-11/12 mx-4 mb-8" />

      {data.map((row, i) => (
        <div key={i} className='text-xl font-bold text-left w-full px-6 py-1 mb-4 bg-red-100'>{row}</div>
        ))}
    </div>
  )
}
