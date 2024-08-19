/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
import { createContext,useState } from "react";
import axios from "axios";
import { API_URL_BASE } from "../../assets/Proxy";

export const ExamContext = createContext()


export const ExamProvider = ({children}) => {

   const [message, setMessage] = useState(null)
   const token = localStorage.getItem('auth_cbt_token')
   const [loading, setLoading] = useState(false)
   const [examsHistory,setExamsHistory] = useState([])
   const [examDetails,setExamDetails ] = useState(null)
   const [allGeneralQuestions,setAllGeneralQuestions] = useState([])
   const [userAnswersList,setUserAnswersList] = useState([])
   const [subjectCollection, setSubjectCollection] = useState([])

   const [examGreenFlag, setExamGreenFlag] = useState()
   const [submitted, setSubmitted] = useState(false)

   const [correctionQuestions,setCorrectionQuestions] = useState([])
   const [correctionAnswers,setCorrectionAnswers] = useState([])


  const fetchExamsHistory = (user_id) => {
      setLoading(true)
      axios.get(`${API_URL_BASE}/api/exams-history/${user_id}`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }).then((response) => {
         
         setExamsHistory(response.data.examsHistory);
        //  console.log(response.data.examsHistory)
       }).catch((error) => {
         setMessage(error.message)
       }).finally(() => {
         setLoading(false)
       })
  }

  const confirmIfActiveExams = (user_id) => {
    axios.get(`${API_URL_BASE}/api/confirm-active/${user_id}`)
    .then((response) => {
        if(response.data.status === true){
          setExamGreenFlag(true)
        }else {
          setExamGreenFlag(false)
        }
      })
    .catch((error) => {
      console.log(error.response.data.message)
    })
  }

  const getActiveExam = (user_id) => {  
   setLoading(true)
   axios
     .get(`${API_URL_BASE}/api/get-active-exams/${user_id}`, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     })
     .then((response) => {
       setExamDetails(response.data.exams_details);
       setAllGeneralQuestions(response.data.exams_details.questions.questions);
      // getSelectedAnswers(user_id)
      const user_id = response.data.exams_details.exams_id
      const questions = response.data.exams_details.questions.questions
      let subjectCol = []
      
      questions.map((item) => {
         return subjectCol.push(item.subject) 
      })
      setSubjectCollection(subjectCol)
      // console.log(subjectCol)
      getSelectedAnswers(user_id)

     })
     .catch((error) => {
       console.error('Failed to fetch user data', error);
     }).finally(() => {
      setLoading(false)
     })
 };


  //  ****************************
  const getSelectedAnswers = (exams_id) => {
    setLoading(true)
    axios.get(`${API_URL_BASE}/api/get-user-active-answers/${exams_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setUserAnswersList(response.data.user_answers)
    })
    .catch((error) => {
      console.error('Failed to fetch user data', error);
    }).finally(() => {
        setLoading(false);
    })

  }

  // *******************************
  // *******************************
  const makeAnswerPost = (data) => {
    axios.post(`${API_URL_BASE}/api/post-exam-answer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
        // console.log(response.data.user_answers)
        setUserAnswersList(response.data.user_answers)
        // populateSelectedActiveSubject(selectActiveSubject ,userAnswersList)

    }).catch((error) => {
        console.error(error)
    }).finally(() => {
      setLoading(false)
    })
  }


  // ******************************
  // ******************************
  const createNewExamSession = (url, examData, hrefLocation) => {
      // return console.log(hrefLocation)
      setLoading(true)
      axios.post(url, examData, {
        headers: { 'Authorization': `Bearer ${token}`}
     }).then(response => {
        if(response.data.status === 'true'){
          setExamGreenFlag(true)
          //  window.location.href = hrefLocation;

          //  navigate(`${hrefLocation}`)
           // navigate('/custom-exam')
           setTimeout(() => {
              setExamGreenFlag(false)
           }, 3000)

          //  console.log(response.data)
        }
        
     }).catch(error => {
        setMessage('Failed to fetch user data', error)
        console.error('Failed to fetch user data', error);
     }).finally(() => {
        setLoading(false)
     })
  }


  // ******************************
  // ******************************
  const confirmSubmitExam = (examInfo) => {
    setLoading(true)
    axios.post(`${API_URL_BASE}/api/end-exams`, examInfo, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then((response) => {
      if(response.data.status === true){
        setSubmitted(true)
        setExamGreenFlag(false)
      }
    }).catch((error) => {
      console.log(error)
      alert(error.data.message)
    }).finally(() => {
      setLoading(false)
    })
  }
  // ******************************
  // ******************************

  const getCorrection  = (exams_id) => {
    axios
    .get(`${API_URL_BASE}/api/exams-answers-history/${exams_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
     
      setExamDetails(response.data.exams_details);
      setCorrectionQuestions(response.data.exams_details.questions_set_id.questions);
      setCorrectionAnswers(response.data.exams_details.answers);

      const questions = response.data.exams_details.questions_set_id.questions
      let subjectCol = []
      
      questions.map((item) => {
         return subjectCol.push(item.subject) 
      })
      setSubjectCollection(subjectCol)


    })
    .catch((error) => {
     
      console.error('Failed to fetch user data', error);
      setLoading(false)
    }).finally(() => {
      setLoading(false)
    })
  }
  
  // ******************************
  // ******************************

  const deleteExams = (examId) => {
    setLoading(true)
    axios.post(`${API_URL_BASE}/api/delete-exams/${examId}`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then((response) => {
      setExamsHistory(response.data.exams_history);  
      setMessage(response.data.message)

    }).catch((error) => {
      console.log(error)
      alert(error.data.message)
    }).finally(() => {
      setLoading(false)
    })
  }



   return (
      <ExamContext.Provider value={{
         message,
         loading,         
         examsHistory,
         allGeneralQuestions,
         userAnswersList,
         subjectCollection,
         examDetails,
         examGreenFlag,
         setExamGreenFlag,
         submitted,
         setSubmitted,
         setCorrectionAnswers,
         setCorrectionQuestions,
         correctionAnswers,
         correctionQuestions,
         setUserAnswersList,
         fetchExamsHistory,
         getActiveExam,
         getSelectedAnswers,
         makeAnswerPost,
         createNewExamSession,
         confirmSubmitExam,
         getCorrection,
         deleteExams,
         setMessage,
         confirmIfActiveExams,

      }}>
         {children}

      </ExamContext.Provider>
  
   );
};

