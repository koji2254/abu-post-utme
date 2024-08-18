/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import Spinner from '../components/Spinner';
import { NavLink, useNavigate } from "react-router-dom";
import { ExamContext } from "../context/Exams/ExamContext";
import { UserContext } from "../context/user/UserContext";


const PerformanceHistory = () => {

  const token = localStorage.getItem('auth_cbt_token');
  const { examsHistory, loading, fetchExamsHistory } = useContext(ExamContext);
  const { getUser, user, setPageUrl, pageUrl } = useContext(UserContext)

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  setPageUrl(location.pathname)

  useEffect(() => {
    if(!token){
      navigate('/signin')
    }
    if(user === null){
      getUser()
    }
  },[])

  
  useEffect(() => {
    if (user) {
      fetchExamsHistory(user.user_id);
    }
  }, [user]); 


  const handleClickCorrections = (exams_id) => {
    // e.preventDefault()

    // window.location.assign(`http://127.0.0.1:8000/custom-correction/${exams_id}`)
    navigate(`/correction/${exams_id}`)
    // window.location.href = `http://127.0.0.1:8000/custom-correction/${user.user_id}/${exams_id}/${token}`
  }

  function formatDateToDayMonth(dateString) {
    // Use Date object to parse the date string
    const date = new Date(dateString);
  
    // Format the date using strftime (or toLocaleDateString for some browsers)
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      separator: "/",
    });
  
    // Alternative using strftime (requires moment.js library)
    // const moment = require('moment'); // If you're using moment.js
    // const formattedDate = moment(dateString).format("DD/MM");
  
    return formattedDate;
  }
  

  return (
    <div className="overal-section w-full">
      {loading && <Spinner />}
      <div className="md:w-8/12 m-3">
      <div className="flex items-center">
        <h1 className="font-mono text-lg font-bold">Exams History: </h1> 
        <NavLink to='/exam-step' className='text-gray-900 font-semibold p-2 text-xs rounded underline'>
          New Exam
        </NavLink>
      </div>
        
        <div className="history-container">
          {examsHistory.length === 0 ? (
            <div className="p-2 border rounded bg-gray-100 text">
              <h1 className="text-lg space-grotesk">No Exams History Found</h1>
             
            </div>
          ) : (
            examsHistory.map((item, index) => (
        
              <div key={index} className="history-card bg-gray-50 shadow border rounded mt-1">
                <div className="w-full p-2 flex justify-between text-gray-black items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-sm w-16 text-center bg-gray-900 text-gray-200 rounded px-1 space-grotesk">
                      <h6 className="text-xs">{formatDateToDayMonth(item.created_at)}</h6>
                      <h4 className="text-xs font-semibold p-1">{item.exam_type}</h4>
                    </div>
                    <div>
                    <div className="text-sm bg-gray-700 w-14 h-10 rounded px-1 space-grotesk">
                      <p className="text-gray-300 text-xs ">score</p>
                      <p className="text-gray-50 text-xs text-center">{Math.ceil(item.score * 2.2222222222)}{item.exam_type === 'standard' ? '/400' : ''}</p>
                    </div>
                  </div>

                  </div>
                  <div>
                    <button onClick={() => handleClickCorrections(item.exams_id)} className="font-mono text-sm text-gray-900 p-1 hover:bg-gray-800 hover:text-white underline font-mono">Answers</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceHistory;
