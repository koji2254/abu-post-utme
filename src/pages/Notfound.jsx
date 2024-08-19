import { Link } from "react-router-dom"


const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
         <h1 className="text-9xl font-bold text-gray-500">404</h1>
         <p className="text-2xl text-gray-700">Page not found</p>
         <Link to="/" className="mt-4 text-blue-500 hover:underline">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15   
             19l-7-7 7-7" />
           </svg>
           Home
         </Link>
       </div>
  )
}

export default Notfound