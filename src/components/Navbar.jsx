/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LogoWide from "../assets/images/logo-wide.png";
import { UserContext } from "../context/user/UserContext";

const Navbar = () => {
  const location = useLocation()
  
  // console.log(location.pathname)
  const [isActiveExamPage, setIsActiveExamPage] =  useState(false)
  const [activeExams, setActiveExams] = useState(false)

  const { 
        user,
        logOut,
        loading,
        pageUrl,
        setPageUrl,
    } = useContext(UserContext)

  useEffect(() =>{
    if(pageUrl === '/active-exam'){
      setActiveExams(true)
    }

    if(pageUrl !== '/active-exam'){
      setActiveExams(false)
    }

  }, [pageUrl, setPageUrl])


  return (
    <>
      <div className="mx-1 my-1 mt-1 bg-gray-800 p-3 rounded">
        <div className="w-full flex justify-between items-center py-1 px-3">
          <div className="logo-icon">
            <NavLink to='/' className="flex items-center gap-1">
              <img src={LogoWide} className="w-10" alt="ABU" />
              <span className="hidden sm:flex text-lg space-grotesk tx-pr-green font-semibold">Ahmadu Bello University</span>
            </NavLink>
          </div>
          <div className="flex items-center gap-0.5 md:gap-2">
            { user === null ? (
              <>
                <NavLink to='/signin'>
                  <span className="bg-gray-500 text-gray-100 font-mono text-xs p-2">
                    Sign-in
                  </span>
                </NavLink>
                <NavLink to='/signup'>
                  <span className="bg-gray-500 text-gray-100 font-mono text-xs p-2">
                    Sign-Up
                  </span>
                </NavLink>
              
              </>
            ) : (
              <>
              {activeExams === true ? <p className="text-lg md:text-xl font-semibold uppercase text-gray-100 mt-2 space-grotesk">Exams In Progress . . .</p> : (
                <>
                  <NavLink to='/'>
                    <span className="text-gray-100 font-mono text-xs p-2">
                      dashboard
                    </span>
                  </NavLink>
                  <NavLink to='/profile'>
                    <span className="text-gray-100 font-mono text-xs p-2">
                      profile
                    </span>
                  </NavLink>
                  <NavLink to='/about'>
                  <span className="text-gray-100 font-mono text-xs p-2">
                    Contact
                  </span>
                 </NavLink>
                  <span onClick={logOut} className="text-red-500 font-mono text-xs p-2 cursor-pointer">
                    Logout 
                  </span>
                </>
              )}
              </>
            )}
          </div>
        </div>
        { activeExams === true ? '' : (
          <p className="text-lg md:text-xl font-semibold uppercase text-gray-100 mt-2 space-grotesk">
          Practice Post UTME Demo Exams
          </p>
        )}
        
      </div>
    </>
  );
};

export default Navbar;
