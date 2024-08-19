/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import GreenBtn from '../components/GreenBtn';
import { UserContext } from '../context/user/UserContext';
import { SubjectCombinationContext } from '../context/subjectCombination/SubjectCombinationContext';
import ErrAlert from '../components/ErrAlert';
import SuccAlert from '../components/SuccAlert';


const SubjectCombination = () => {
  const { getSubjectCombination, getSubjectList, subjectList, subjectSet, updateSubjectCombination, message, loading, setMessage} = useContext(SubjectCombinationContext);
  const { getUser, user, loginStatus, pageUrl, setPageUrl } = useContext(UserContext);
  
  const [error, setError] = useState(null)
  const [succ, setSucc] = useState(null)

  const token = localStorage.getItem('auth_cbt_token');
  const navigate = useNavigate();

  useEffect(() => {
    if(token){
      if(!user) {
        getUser();
        if(subjectList.length === 0){
          getSubjectList();
        }
      }
    }

  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (user && user.user_id) {
      if(subjectSet === null){
         getSubjectCombination(user.user_id);
      }
    }
  }, [user]); // This runs only when user.user_id changes

  const [subjectOne, setSubjectOne] = useState('ENGLISH LANGUAGE');
  const [subjectTwo, setSubjectTwo] = useState(subjectSet?.subject_two || '');
  const [subjectThree, setSubjectThree] = useState(subjectSet?.subject_three || '');
  const [subjectFour, setSubjectFour] = useState(subjectSet?.subject_four || '');

  useEffect(() => {

    if (subjectSet) {
      setSubjectTwo(subjectSet.subject_two);
      setSubjectThree(subjectSet.subject_three);
      setSubjectFour(subjectSet.subject_four);
    }

    if(message){
      setSucc(message)
    }

  }, [subjectSet, message]);

  const submitSubjectCombination = () => {
    const data = {
      user_id: user.user_id,
      subject_one: subjectOne,
      subject_two: subjectTwo,
      subject_three: subjectThree,
      subject_four: subjectFour,
    };
  
    updateSubjectCombination(data)
  };

  const onChangeSubjectOne = (e) => {
    setSubjectOne(e.target.value);
  };

  const onChangeSubjectTwo = (e) => {
    setSubjectTwo(e.target.value);
  };

  const onChangeSubjectThree = (e) => {
    setSubjectThree(e.target.value);
  };

  const onChangeSubjectFour = (e) => {
    setSubjectFour(e.target.value);
  };

  
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
    <div className='h-screen'>
      {error && <ErrAlert text={error} />}
      {succ && <SuccAlert text={succ} />}
      {loading && <Spinner />}
      <div className="mx-1 shadow rounded space-grotesk bg-green-50 p-2">
        <h1 className='text-lg font-semibold'>Select your subject combination:</h1>
        <p className='text-sm font-nunito mt-2'>NOTE: English Language is Selected</p>
      </div>

      <div className="md:w-8/12 p-2 mt-3 rounded text-white">
        <div className="border border-gray-800 p-2 rounded">
          <h1 className='text-black font-bold text-sm space-grotesk'>Selected Subjects</h1>
          <p className='font-light text-gray-700 text-sm'>Please ensure that you don't select thesame subject twice</p>
          <div className='my-4 flex flex-wrap gap-2'>
              <span className='p-1 border border-gray-700 bg-gray-800'>{subjectOne}</span>
              <span className='p-1 border border-gray-700 bg-gray-800'>{subjectSet?.subject_two || 'Select Subject Two'}</span>
              <span className='p-1 border border-gray-700 bg-gray-800'>{subjectSet?.subject_three || 'Select Subject Three'}</span>
              <span className='p-1 border border-gray-700 bg-gray-800'>{subjectSet?.subject_four || 'Select Subject Four'}</span>
            </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="bg-gren-100 shadow nunito text-sm rounded p-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className='mt-2'>
              <label htmlFor='' className='my-1 block text-xs font-semibold text-blue-600'>Subject One</label>
              <select name='' id='' className='bg-gray-800 border border-gray-500 p-2 w-full'>
                <option value='ENGLISH LANGUAGE'>ENGLISH LANGUAGE</option>
              </select>
            </div>
            <div className='mt-2'>
              <label htmlFor='' className='my-1 block text-xs font-semibold text-blue-600'>Subject Two</label>
              <select name='' id='' value={subjectTwo} onChange={onChangeSubjectTwo} className='bg-gray-50 text-gray-600 border border-gray-600 p-2 w-full'>
                <option selected disabled>select subject</option>
                  <option value="">2nd Subject</option>
                {subjectList.length === 0 ? (
                  <p>No Subjects Available</p>
                ) : (
                  subjectList.map((subject, index) => (
                    <option key={index} value={subject.subject} subject_id={subject.subject_id}>{subject.subject}</option>
                  ))
                )}
              </select>
            </div>
            <div className=''>
              <label htmlFor='' className='my-1 block text-xs font-semibold text-blue-600'>Subject Three</label>
              <select name='' id='' value={subjectThree} onChange={onChangeSubjectThree} className='bg-gray-50 text-gray-600 border border-gray-600 p-2 w-full'>
                  <option value="">3rd Subject</option>
                {subjectList.length === 0 ? (
                  <p>No Subjects Available</p>
                ) : (
                  subjectList.map((subject, index) => (
                    <option key={index} value={subject.subject} subject_id={subject.subject_id}>{subject.subject}</option>
                  ))
                )}
              </select>
            </div>
            <div className=''>
              <label htmlFor='' className='my-1 block text-xs font-semibold text-blue-600'>Subject Four</label>
              <select name='' id='' value={subjectFour} onChange={onChangeSubjectFour} className='bg-gray-50 text-gray-600 border border-gray-600 p-2 w-full'>
                  <option value="">4th Subject</option>
                {subjectList.length === 0 ? (
                  <p>No Subjects Available</p>
                ) : (
                  subjectList.map((subject, index) => (
                    <option key={index} value={subject.subject} subject_id={subject.subject_id}>{subject.subject}</option>
                  ))
                )}
              </select>
            </div>
          </div>  
        </div>
      </div>

      <div className='md:w-8/12 p-2 px-4 rounded text-white'>
          <div className='grid grid-cols-2 gap-3'>
            <GreenBtn className='bg-pr-green' onClick={submitSubjectCombination} text='SUBMIT COMBINATION' />
            <NavLink className='bg-white hover:bg-green-100 border border-gray-800 rounded text-green-600' to={'/'}>
             <button className='w-full h-full space-grotesk'>Cancel</button>    
            </NavLink>
          </div>
      </div>
    </div>
  );
};

export default SubjectCombination;
