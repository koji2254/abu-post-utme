/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import Spinner from '../components/Spinner';
import { NavLink, useNavigate } from "react-router-dom";
import { ExamContext } from "../context/Exams/ExamContext";
import { UserContext } from "../context/user/UserContext";
import ErrAlert from '../components/ErrAlert';
import SuccAlert from '../components/SuccAlert';


const PerformanceHistory = () => {

  const token = localStorage.getItem('auth_cbt_token');
  const { examsHistory, loading, fetchExamsHistory, setSubmitted, deleteExams, message, setMessage, setCorrectionAnswers,
    setCorrectionQuestions,setExamGreenFlag, examGreenFlag, confirmIfActiveExams } = useContext(ExamContext);
  const { getUser, user, setPageUrl, pageUrl } = useContext(UserContext)

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null)
  const [succ, setSucc] = useState(null)

  setPageUrl(location.pathname)
  setSubmitted(false)

  useEffect(() => {
    if(!token){
      navigate('/signin')
    
    }else if(user === null){
      getUser()
    }

    setCorrectionAnswers([])
    setCorrectionQuestions([])
  },[])

  
  useEffect(() => {
    if (user) {
      fetchExamsHistory(user && user.user_id);

      confirmIfActiveExams(user && user.user_id)
    }
  }, [user]); 

  
  useEffect(() => {
    if(examGreenFlag === true){
      setSucc('You have an unfinished Exam session')
      navigate('/active-exam')
    }
  }, [examGreenFlag])

  const handleClickCorrections = (exams_id) => {
    // e.preventDefault()

    // window.location.assign(`http://127.0.0.1:8000/custom-correction/${exams_id}`)
    navigate(`/correction/${exams_id}`)
  }

  const handleMyDelete = (examId) => {
    if(window.confirm('Delete Exams')){
      deleteExams(examId)
    }
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
  
    return formattedDate;
  }
  
  useEffect(() => {
    if(message){
      setSucc(message)
    }
  }, [message])
  
  useEffect(() => {
    if(error !== null){
      setTimeout(() => {
        setError(null)
        setMessage(null)
      }, 2000)
    }

    if(succ !== null){
      setTimeout(() => {
        setSucc(null)
        setMessage(null)
      }, 2000)
    }
  }, [error, succ])


  return (
    <div className="h-screen overal-section w-full">

    {error && <ErrAlert text={error} />}
    {succ && <SuccAlert text={succ} />}

      {loading && <Spinner />}
      <div className="md:w-8/12 m-3">
      <div className="flex items-center">
        <h1 className="font-mono text-lg font-bold">Exams History: </h1> 
        <NavLink to='/exam-step' className='text-gray-900 font-semibold p-2 text-xs rounded underline'>
          New Exam
        </NavLink>
        {/* <a href='/exam-step' className='text-gray-900 font-semibold p-2 text-xs rounded underline'>
          New Exam
        </a> */}
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
                    <div className="p-2 flex flex-col justify-center items-center text-sm w-16 bg-gray-900 text-gray-200 rounded space-grotesk">
                      <h6 className="text-xs flex justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg> {formatDateToDayMonth(item.created_at)}</h6>
                      <h4 className="text-xs font-semibold">{item.exam_type}</h4>
                    </div>
                    <div>
                    <div className=" flex flex-col justify-center items-center text-sm bg-gray-700 rounded p-2 space-grotesk">
                      <p className="text-gray-100 text-xs flex justify-center">score</p>
                      <p className="text-gray-50 text-xs text-center">{Math.ceil(item.score * 2.2222222222)}{item.exam_type === 'standard' ? '/400' : ''}</p>
                    </div>
                  </div>

                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleMyDelete(item.exams_id)} className="flex items-center font-mono p-2 text-sm bg-gray-700 text-gray-100 rounded-full hover:bg-gray-800 hover:text-white font-mono">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>

                    <button onClick={() => handleClickCorrections(item.exams_id)} className="flex items-center font-mono p-2 text-sm bg-gray-700 text-gray-100 rounded-full hover:bg-gray-800 hover:text-white font-mono">Answers <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                  </button>
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
