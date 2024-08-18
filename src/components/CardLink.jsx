/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"

const CardLink = ({ headText, description, urlLink }) => {
  return (
   <div className="w-full mt-2">
   <div className="md:w-8/12 m-2 border rounded bg-green-50 p-5">
       <div className="">
         <div className=" text-l ">
          <p className="font-semibold font-mono">{headText}</p>
          <span className="text-sm">{description}</span>
         </div>
         <NavLink to={`/${urlLink}`} className=''>
           <button className="my-2 text-sm rounded border-none text-white   flex items-center p-2 px-4 bg-gray-800 hover:bg-gray-900" >
           open 
           </button>
         
         </NavLink>
       </div>
      </div>
   </div>
   )
}

export default CardLink