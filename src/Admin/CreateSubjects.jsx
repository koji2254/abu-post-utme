/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useRef } from "react"
import GreenBtn from "../components/GreenBtn"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getAuthToken, setupAxiosInterceptors } from '../utils/auth';

const CreateSubjects = () => {

   const [isLoading, setIsLoading] = useState(true);
   const [subjectList, setSubjectList] = useState([]);
   const [newSubject, setNewSubject] = useState('');

   const inputRefs = useRef([]);

   const token = localStorage.getItem('auth_cbt_token');

   const navigate = useNavigate();

   useEffect(() => {
  
      if(!token){
        navigate('/signin')
      }
      
      axios.get('http://127.0.0.1:8000/api/all-subjects', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => {
        if(response.data.message === 'Unauthenticated') {
          navigate('/signin')
        }
        setIsLoading(false)
        setSubjectList(response.data.allSubjects)
      })
      .catch(error => {
        setIsLoading(false)
          console.error('Failed to fetch user data', error);
      });

    }, [])
  

   const addSubject = (e) => {

      if(newSubject === '' ||newSubject === null) {
         alert('Please Insert Subject')
      }
      setIsLoading(true)
      axios.post('http://127.0.0.1:8000/api/upload-subject',
         { 
            subject: newSubject.toUpperCase() 
         },
         { 
            headers: {
            'Authorization' : `Bearer ${token}`
         },
       }
      ).then((response) => {
         // console.log(response.data.allSubjects)
         setIsLoading(false)
         setNewSubject('')
         alert(response.data.message)
         setSubjectList(response.data.allSubjects)
      }).catch((error) => {
         setIsLoading(false)
         alert(error.response.data.message)
         // console.log(error)
      })
   }

   const submitUpdateSubject = (index) => {
      const subjectId = subjectList[index].subject_id;
      const updatedValue = inputRefs.current[index].value;
      
      setIsLoading(true)
      axios.put('http://127.0.0.1:8000/api/update-subject',
         {subject_id: subjectId, subject: updatedValue},
         {
            headers :{
               Authorization: `Bearer ${token}`,
            }
         },
      ).then((response) => {
         setSubjectList(response.data.allSubjects)
         setIsLoading(false)
         alert(response.data.message)
      }).catch((error) => {
         setIsLoading(false)
         alert(error)
      })
   }

   const submitDeleteSubject = (subjectId) => {
      setIsLoading(true)
      axios.delete(`http://127.0.0.1:8000/api/delete-subject/${subjectId}`,{
         headers: {
            Authorization: `Bearer ${token}`,
         },
      }).then((response) => {
         setSubjectList(response.data.allSubjects)
         setIsLoading(false)
         alert(response.data.message)
      }).catch((error) => {
         setIsLoading(false)
         alert(error.response.message)
      })
   }


   if(isLoading) {
      return <Spinner />
   }

  return (
    <>
     <div className="p-2">
      <h1 className="font-bold uppercase text-2xl text-gray-800">Upload and edit subjects</h1>
      <div className="bg-gray-100 my-2 p-2">
         <h2 className="font-bold text-blue-950 my-1">Create Subject form</h2>
         <div className="flex items-center gap-2">
         <input
              type="text"
              placeholder="subject title"
              className="p-2 rounded border border-green-500"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <GreenBtn onClick={addSubject} text={'Add subject'} />
         </div>
      </div>
      <div className="w-full bg-gray-100 p-2">
         <h2 className="font-bold text-gray-600 my-1">Subject List</h2>
         <div className="md:w-8/12 subject-list-container">

         {subjectList.length === 0 ? (
              <p>No subjects found.</p>
            ) : (
              subjectList.map((subject, index) => (
                <div
                  key={subject.subject_id}
                  className="subject-list-card mt-1 full-flex justify-between bg-gray-50 pr-2"
                >
                  <input
                    type="text"
                    name="update-box"
                    subject_id={subject.subject_id} 
                    defaultValue={subject.subject}
                    className="font-semibold p-1 text-sm border w-64"
                    ref={(element) => inputRefs.current[index] = element}
                    
                  />
                  <div className="full-flex gap-2">
                    <button
                      onClick={() => submitUpdateSubject(index)}
                      subject_id={subject.subject_id}
                      className="border border-gray-200 p-0.5 text-xs text-gray-500 hover:bg-gray-200"
                    >
                      update
                    </button>
                    <button
                      onClick={() => submitDeleteSubject(subject.subject_id)}
                      subject_id={subject.subject_id}
                      className="border border-gray-200 p-0.5 text-xs text-red-500 hover:bg-gray-200"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))
            )}
              
         </div>   
      </div>
     </div>


    </>
  )
}

export default CreateSubjects