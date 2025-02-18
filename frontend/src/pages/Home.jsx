import { Sidebar } from "../components/Home/Sidebar"

export const Home = () => {
  return (
    <div className="h-screen w-screen">
      <div className="grid grid-cols-10 gap-2 bg-blue-300 h-full">
        <div className="channels col-span-3 border-r-2 border-blue-400">
          <Sidebar />
        </div>
        <div className="col-span-7 ">asd</div>
      </div>
    </div>
  )
}
