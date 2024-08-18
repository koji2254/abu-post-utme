/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import axios from 'axios'
import GreenBtn from '../components/GreenBtn'
import Card from '../components/Card'
import { UserContext } from "../context/user/UserContext";
import { SubjectCombinationContext } from '../context/subjectCombination/SubjectCombinationContext'
import { ExamContext } from '../context/Exams/ExamContext'

const ExamStep = () => {
   const navigate = useNavigate()
   const { user, getUser, getUserProfile, profileData, loading, setLoading, loginStatus, setPageUrl, pageUrl } = useContext(UserContext)
   const { getSubjectCombination, subjectSet } = useContext(SubjectCombinationContext)
   const { createNewExamSession, examGreenFlag } = useContext(ExamContext)

   const [subjectOne, setSubjectOne] = useState('ENGLISH LANGUAGE')
   const [subjectTwo, setSubjectTwo] = useState('')
   const [subjectThree, setSubjectThree] = useState('')
   const [subjectFour, setSubjectFour] = useState('') 
   // 
   const [customSubjectOne, setCustomSubjectOne] = useState('')
   const [customSubjectTwo, setCustomSubjectTwo] = useState('')
   const [customSubjectThree, setCustomSubjectThree] = useState('')
   const [customSubjectFour, setCustomSubjectFour] = useState('')

   const [checkedOne, setCheckedOne] = useState(false);
   const [checkedTwo, setCheckedTwo] = useState(false);
   const [checkedThree, setCheckedThree] = useState(false);
   const [checkedFour, setCheckedFour] = useState(false);
  
   const [qtyOne, setQtyOne] = useState(0)
   const [qtyTwo, setQtyTwo] = useState(0)
   const [qtyThree, setQtyThree] = useState(0)
   const [qtyFour, setQtyFour] = useState(0)
   const [customTime, setCustomTime] = useState(1)
   // const [examType, setSubjectFour] = useState('') 

   const [examType, setExamType] = useState('standard')
   
   const token = localStorage.getItem('auth_cbt_token');
   setPageUrl(location.pathname)

    useEffect(() => {
      if(!token){
         navigate('/signin')
      }
      
      if(user){
         if(subjectSet === null){
            getSubjectCombination(user.user_id)
            getUserProfile(user.user_id)
         }
      }

      if(user === null){
         getUser()
      }
    },[])

   // - - - - - - - - - - - - - - - - - - - 
    useEffect(() => {
      if(user){
         if(subjectSet === null){
            getSubjectCombination(user.user_id)
            getUserProfile(user.user_id)
         }
      }
      // if(user === null){
      //    navigate('/signin')
      // }
    },[user])

    
   useEffect(() => {
      if(loginStatus === false){
      navigate('/signin')
      }

   }, [loginStatus])


   //  @ Sets up the subject conbination to initial state
   useEffect(() => {
      if(subjectSet !== null){
         setSubjectOne(subjectSet.subject_one)
         setSubjectTwo(subjectSet.subject_two)
         setSubjectThree(subjectSet.subject_three)
         setSubjectFour(subjectSet.subject_four)
      }
    }, [subjectSet])

   //  @Navigate to the Exams page
   useEffect(() => {
      if(examGreenFlag === true){
         navigate('/active-exam')
      }
   }, [examGreenFlag])



    const submitExamStep = () => {
      let examData = ''
      let url = ''
      let hrefLocation = ''

      if(examType === 'standard'){
         examData = {
            user_id: user.user_id,
            exam_type: examType
         }
         url = `http://127.0.0.1:8000/api/exam-step`
         hrefLocation = `/active-exam`
         // hrefLocation = `http://127.0.0.1:8000/custom-exam/${user.user_id}/${token}`
         // hrefLocation = 'http://127.0.0.1:8000/custom-exam'

      }else if(examType === 'custom') {

         // ## Passed to the Second Part
          let exam_properties = {}
      
          if (checkedOne) {
            // @Make sure that the Qty is Set
            if(!qtyOne || qtyOne === 0){
              return alert(`${subjectOne} question can't be Zero`)
            }
            exam_properties = {
               ... exam_properties,
              subject_one: subjectOne,
              qty_one: qtyOne,
            };
          }
          if (checkedTwo) {
              // @Make sure that the Qty is Set
               if(!qtyTwo || qtyTwo === 0){
                 return alert(`${subjectTwo} question can't be Zero`)
               }
            exam_properties = {
               ...exam_properties,
              subject_two: subjectTwo,
              qty_two: qtyTwo,
            };
          }
          if (checkedThree) {
            // @Make sure that the Qty is Set
               if(!qtyThree || qtyThree === 0){
                 return alert(`${subjectThree} question can't be Zero`)
               }
            exam_properties = {
               ...exam_properties,
              subject_three: subjectThree,
              qty_three: qtyThree,
            };
          }
          if (checkedFour) {
            // @Make sure that the Qty is Set
               if(!qtyFour || qtyFour === 0){
                 return alert(`${subjectFour} question can't be Zero`)
               }
            exam_properties = {
               ...exam_properties,
               subject_four: subjectFour,
               qty_four: qtyFour
            }
         }
         // @ *********************************************************
         //  #Checks to make sure that a subject has being selected
         if(!checkedOne && !checkedTwo && !checkedThree && !checkedFour){
            return alert('NOTE::Please Select a Subject')
         }

         // #Making sure that at leat a Qty is set
          if((!qtyOne || qtyOne === 0) && (!qtyTwo || qtyTwo === 0) && (!qtyThree || qtyThree === 0) && (!qtyFour || qtyFour === 0)){
            return alert('NOTE::Please set a Valid Questions Qty')
          }

         //  #Making sure that the time is !== 0
         if(!customTime || customTime < 1){
            return alert('Time must be more than One Minute')
         }
         // @ *********************************************************

         examData = {
            user_id: user.user_id,
            exam_type: examType,
            allocated_time: customTime,
            ...exam_properties,
          };

         url = 'http://127.0.0.1:8000/api/set-custom-exams'
         hrefLocation = '/custom-exam'
         // hrefLocation = `http://127.0.0.1:8000/custom-exam/${user.user_id}/${token}`
         // return console.log(examData)
      }
      setLoading(true)
      createNewExamSession(url, examData, hrefLocation)

    }

    const handleExamType = (e) => {

      setExamType(e.target.value)
    }


 
    const setExamsProcess = () => {
      const examData = {
         user_id: user.user_id,
         exam_type: examType,
         exam_properties: {
            // all the states info should be in here
         },
      }
    }

    const handleQtyChange = (setter) => (e) => {
      let value = e.target.value;
      if (value === "-1") {
        value = 0; // Set to empty string if value is "-1"
      } else {
        value = Math.min(100, parseInt(value, 10)); // Convert to integer and limit to 100
      }
      setter(value);
    };

    
    const handleTimeChange = (setter) => (e) => {
      let value = e.target.value;
      if (value === "-1") {
        value = 0; // Set to empty string if value is "-1"
      } else {
        value = Math.min(150, parseInt(value, 10)); // Convert to integer and limit to 100
      }
      setter(value);
    };

  return (
    <>
      <div className="overal-section w-full">
         {loading && <Spinner />}
         <div className="mx-1 bg-white rounded p-2 md:w-8/12">
            <h2 className='my-1 font-mono font-bold text-lg'>Exams Type</h2>
            <div className="flex font-nunito items-center w-full gap-2 justify-between">
               <Card head={'Standard'} body="Answer Question according to the standards of JAMB" />
               <Card head={'Custom'} body="Answer Question by chossing specifics" />
            </div>
            <div className='mt-2 shadow space-grotesk py-3'>
               <label className='p-2 font-bold text-gray-900' htmlFor="">Select Exam Type</label>
               <select onChange={handleExamType} value={examType} className='bg-gray-800 rounded text-white p-1 font-semibold' name="" id="">
                  <option selected value="standard">Standard</option>
                  <option value="custom">Custom</option>
               </select>
            </div>
         </div>
         <div className="md:w-8/12 bg-white mx-1 mt-2 rounded">
            <h1 className="font-bold font-mono text-xl py-2 mx-4">Subjects Combinations</h1>
            {examType === 'standard' ? (
               <div className="relative overflow-x-auto">
               <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                           <th scope="col" className="px-4 py-1">
                              Subject
                           </th>
                           <th scope="col" className="px-4 py-1">
                              No. Questions
                           </th>
                           <th scope="col" className="px-4 py-1">
                              Time(mins)
                           </th>
                        </tr>
                  </thead>
                  <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                           <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                             {subjectOne}
                           </th>
                           <td className="px-4 py-1">
                              60
                           </td>
                                                
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                           <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {subjectTwo}
                           </th>
                           <td className="px-4 py-1">
                              40
                           </td>                      
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                           <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {subjectThree}
                           </th>
                           <td className="px-4 py-1">
                              40
                           </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                           <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {subjectFour}
                           </th>
                           <td className="px-4 py-1">
                              40
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               ) : (
               <div className="relative overflow-x-auto">
               <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                           <th scope="col" className="px-4 py-2">
                              Subject
                           </th>
                           <th scope="col" className="px-4 py-2">
                              Qty
                           </th>
                           <th scope="col" className="px-4 py-2">
                             TOTAL Time(mins)
                           </th>
                        </tr>
                  </thead>
                  <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                           <th scope="row" className="px-4 py-2 flex gap-2 items-center font-medium text-gray-900 whitespace-nowrap dark:text-white pt-3">
                             <input 
                                 type="checkbox" 
                                 checked={checkedOne}
                                 onChange={(e) => setCheckedOne(e.target.checked)}
                                 className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' /> {subjectOne}
                           </th>
                           <td className="px-4 py-2">
                              <input 
                                 type="number" 
                                 name='qty_one' 
                                 value={qtyOne}
                                 onChange={handleQtyChange(setQtyOne)}
                                 className='small-input p-2 h-7 w-16 border border-gray-500' 
                              />
                           </td>
                           <td>
                               <input 
                                 value={customTime}
                                 onChange={handleTimeChange(setCustomTime)}
                                 type="number" 
                                 name='qty_1' 
                                 placeholder='INPUT TOTAL TIME' className='bg-gray-100  text-gray-800 font-bold p-3 rounded w-full border' />
                           </td>        
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                           <th scope="row" className="px-4 py-2 flex gap-2 items-center font-medium text-gray-900 whitespace-nowrap dark:text-white pt-3">
                             <input 
                                 type="checkbox" 
                                 checked={checkedTwo}
                                 onChange={(e) => setCheckedTwo(e.target.checked)}
                                 className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' /> {subjectTwo}
                           </th>
                           <td className="px-4 py-2">
                              <input 
                                 type="number" 
                                 name='qty_two' 
                                 value={qtyTwo}
                                 onChange={handleQtyChange(setQtyTwo)}
                                 className='small-input p-2 h-7 w-16 border border-gray-500' />
                           </td>                      
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800">
                        <th scope="row" className="px-4 py-2 flex gap-2 items-center font-medium text-gray-900 whitespace-nowrap dark:text-white p-3">
                             <input 
                                 type="checkbox" 
                                 checked={checkedThree}
                                 onChange={(e) => setCheckedThree(e.target.checked)}
                                 className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' 
                              /> {subjectThree}
                           </th>
                           <td className="px-4 py-2">
                             <input 
                              type="number" 
                              name='qty_three' 
                              onChange={handleQtyChange(setQtyThree)}
                              value={qtyThree}
                              className='small-input p-2  h-7 w-16 border border-gray-500' />
                           </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-4 py-2 flex gap-2 items-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                             <input 
                                 type="checkbox" 
                                 checked={checkedFour}
                                 onChange={(e) => setCheckedFour(e.target.checked)}
                                 className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' /> {subjectFour}
                           </th>
                           <td className="px-4 py-2">
                              <input 
                                 type="number" 
                                 name='qty_four' 
                                 onChange={handleQtyChange(setQtyFour)}
                                 value={qtyFour}
                                 className='small-input p-2 h-7 w-16 border border-gray-500' />
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               )}
            
         </div>
         <div className="md:w-8/12 bg-white shadow mx-1 mt-1">
           <Card head={'Rules and Regulations'} body={'ABU POST UTME exams rules include no cheating, punctuality,prohibition of electronic devices, no communication with others, follow invigilator instructions.'} />    
         </div>
         <div className="md:w-8/12 bg-white m-3">
            <div className="flex items-center border gap-2 text-gray-900">
               <p className="bg-white p-3 rounded-lg gap-2 items-center">
               {/* <NavLink to='/exam-active'> */}
               <GreenBtn onClick={submitExamStep} text='start' />
              {/* </NavLink> */}
               </p> 
             
            </div>
       
         </div>
      </div>
    
    </>
  )
}

export default ExamStep