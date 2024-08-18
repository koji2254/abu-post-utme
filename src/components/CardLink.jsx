/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"

const CardLink = ({ headText, description, urlLink }) => {
  return (
   <div className="w-full mt-2">
   <div className="md:w-8/12 m-2 border rounded bg-green-50 p-5">
       <div className="flex justify-between">
         <div className=" text-l ">
          <p className="font-semibold font-mono">{headText}</p>
          <span className="text-sm text-black">{description}</span>
         </div>
         <NavLink to={`/${urlLink}`} className=''>
           <button className="my-2 text-sm rounded-full border-none text-white flex items-center p-2 px-4 bg-gray-800 hover:bg-gray-900" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          
           </button>
         
         </NavLink>
       </div>
      </div>
   </div>
   )
}

export default CardLink