/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const SubjectCombinationContext = createContext()
import axios from "axios"
import { API_URL_BASE } from "../../assets/Proxy";

export const SubjectCombinationProvider = ({children}) => {
   const [message ,setMessage] = useState(null)
   const token = localStorage.getItem('auth_cbt_token')
   const [subjectSet, setSubjectSet] = useState(null)
   const [subjectList, setSubjectList] = useState([])
   const [loading, setLoading] = useState(true)
   // const 
   

   const getSubjectList = () => {
      setLoading(true)
      // GET ALL SUBJECTS  
       axios.get(`${API_URL_BASE}/api/all-subjects`, {
         headers: {
            'Authorization': `Bearer ${token}`
         }
       })
       .then(response => {
         setSubjectList(response.data.allSubjects)
       })
       .catch(error => {
           setMessage('Failed to fetch user data', error);
       }).finally(() => {
         setLoading(false)
       })
   }

   const getSubjectCombination = (user_id) => {
      setLoading(true)
      axios.get(`${API_URL_BASE}/api/get-subject-combination/${user_id}`, {
         headers: {
           'Authorization': `Bearer ${token}`
         }
       })
       .then(response => {
         setSubjectSet(response.data.combination)
       })
       .catch(error => {
         console.error('Failed to fetch user data', error);
       }).finally(() => {
         setLoading(false)
       })
   }

   const updateSubjectCombination = (data) => {
    setLoading(true)  
    axios.post(`${API_URL_BASE}/api/submit-combination`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
         setSubjectSet(response.data.combination)
         setMessage(response.data.message)
      })
      .catch(error => {
        setMessage('Failed to submit subject combination', error);
      }).finally(() => {
         setLoading(false)
      })
   }
   
   return (
      <SubjectCombinationContext.Provider value={{
         subjectSet,
         subjectList,
         message,
         setMessage,
         loading,
         getSubjectCombination,
         getSubjectList,
         updateSubjectCombination,
      }}>
         {children}
      </SubjectCombinationContext.Provider>
   );
};


