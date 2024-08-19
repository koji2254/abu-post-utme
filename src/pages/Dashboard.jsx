/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import CardLink from "../components/CardLink"
import UserPng from "../assets/images/user.png"
import { UserContext } from "../context/user/UserContext"
import { SubjectCombinationContext } from "../context/subjectCombination/SubjectCombinationContext"
import { ExamContext } from "../context/Exams/ExamContext"
import Spinner from '../components/Spinner'

const Dashboard = () => {
  const token = localStorage.getItem('auth_cbt_token')
  const navigate = useNavigate();

  const { loginStatus, user, getUser, loading, setPageUrl, pageUrl }  = useContext(UserContext)
  const { setExamGreenFlag, examGreenFlag, confirmIfActiveExams } = useContext(ExamContext)
  const { getSubjectCombination, getSubjectList } = useContext(SubjectCombinationContext)

  const [isBlocking, setIsBlocking] = useState(true);
  const location = useLocation();

  
  setPageUrl(location.pathname)

  //*********************** */ 
  useEffect(() => {
    if(token){
      if(user === null){
        getUser()
     }
    }else {
      navigate('/signin')
    }
    getSubjectList()

  }, [])

  useEffect(() => {
    confirmIfActiveExams(user && user.user_id)
  }, [user])

  useEffect(() => {
    if(examGreenFlag === true){
      navigate('/active-exam')
    }
  }, [examGreenFlag])

  //  - - - - - - ----- - ---------------------------------
  //  - - - - - - ----- - ---------------------------------
  //  - - - - - - ----- - ---------------------------------

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isBlocking) {
        // Trigger the function when the user is trying to leave the page
        console.log('Leaving the page');
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome to show the confirmation dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlocking]);



// --- ----------------------------------------------
  // ************************ /

  return (
    <div className="h-screen">
      {loading && <Spinner />}
      <div className="shadow m-auto mx-1 rounded bg-green-50 p-2 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={UserPng} className="w-10" alt="User" />
            <span className="font-bold text-black space-grotesk text-lg">
              Student: {user && user.name}
            </span>
          </div>
          
        </div>
      </div>
      {/*  */}
      
      <CardLink headText={'START EXAMS'} description={'Take exams now'} urlLink={'exam-step'} />
      {/*  */}
      <CardLink headText={'SUBJECTS COMBINATION'} description={'Select your exams subject combination'} urlLink={'subject-combination'} />
      {/*  */}
      <CardLink headText={'PERFOMANCE HISTORY'} description={'View all exams history and corrections'} urlLink={'performace-history'} />

      {/*  */}
   
   </div>
  )
}

export default Dashboard