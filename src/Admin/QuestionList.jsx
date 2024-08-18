/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const QuestionList = () => {

   const [isLoading, setIsLoading] = useState(true)
   const [subjectList, setSubjectList] = useState([])   
  const [selectedSubject, setSelectedSubject] = useState({ subject: "", subject_id: "" });


   const token = localStorage.getItem('auth_cbt_token');
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!token) {
       navigate('/signin');
     }
 
     axios.get('http://127.0.0.1:8000/api/all-subjects', {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     })
       .then(response => {
         if (response.data.message === 'Unauthenticated') {
           navigate('/signin');
         }
         setIsLoading(false);
         setSubjectList(response.data.allSubjects);
       })
       .catch(error => {
         setIsLoading(false);
         console.error('Failed to fetch user data', error);
       });
 
   }, [token, navigate]);

   const handleSubjectChange = (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const subject = selectedOption.value;
      const subject_id = selectedOption.getAttribute('subject_id');
      setSelectedSubject({ subject, subject_id });

      fetchQuestions(subject_id)
    };


   const fetchQuestions = (subject_id) => {

      console.log(subject_id)
      setIsLoading(true)
      axios.get(`http://127.0.0.1:8000/api/get-questions/${subject_id}`, {
         headers: {
            Authorization: `Bearer ${token}`
         },
      }).then((response) => {

         setIsLoading(false)
         console.log(response.data)
      }).catch((error) => {
         
         setIsLoading(false)
         console.error(error)
      })
   } 
  
 
   if(isLoading) {
      return <Spinner />
   }

  return (
    <>
      <div className="p-2">
      <h1 className="font-bold uppercase text-xl text-gray-800">Questions List</h1>
        <div className="bg-gray-100 my-2 p-2">
          <h2 className="font-bold text-blue-950 my-1">Select Subject</h2>
          <div className="flex items-center gap-2">
            <select name="" id="" className="p-1 bg-gray-200 font-semibold rounded border border-green-500" onChange={handleSubjectChange}>
              <option selected disabled>select subject</option>
              {subjectList.length === 0 ? (
                <p>No Subjects Available</p>
              ) : (
                subjectList.map((subject, index) => (
                  <option key={index} value={subject.subject} subject_id={subject.subject_id}>{subject.subject}</option>
                ))
              )}
            </select>
            <p className="text-bold border p-1 rounded">Subject ID: <input type="text" className="border-none font-bold" value={selectedSubject.subject_id} readOnly /></p>
          </div>
        </div>
        {/*  */}
        <div className="w-full mt-3 border-t-2 p-2">
         <div className="flex gap-2 items-center">
            {selectedSubject.subject && <span className="font-bold p-1 text-gray-100 bg-gray-900 my-1">{selectedSubject.subject} </span>}
            <span></span>
         </div>
        
            <div className="question-list-container ">
               <div className="question-list-card">
               
               </div>  
            </div>  
        </div>
      </div> 

    </>
  )
}

export default QuestionList