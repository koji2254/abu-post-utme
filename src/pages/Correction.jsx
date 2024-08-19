/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams, NavLink } from "react-router-dom"
import { UserContext } from "../context/user/UserContext";
import { ExamContext } from "../context/Exams/ExamContext";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Correction = () => {
  const navigate = useNavigate()
  const { getUser, user } = useContext(UserContext)
  const token = localStorage.getItem('auth_cbt_token')
  const { correctionQuestions, 
          correctionAnswers, 
          subjectCollection, 
          getCorrection,
          loading
        } = useContext(ExamContext)
  const [activeSubject, setActiveSubject] = useState(subjectCollection[0])
  const [activeSubjectQuestions, setActiveSubjectQuestions] = useState([])
  const [activeAnswers, setActiveAnswers] = useState([])
  
  const [singleAnswer, setSingleAnswer] = useState(null)
  const [singleQuestion, setSingleQuestion] = useState(0)
  const [singleIndex, setSingleIndex] = useState(null)

  const { exams_id } = useParams();

  useEffect(() => {
    if(!token){
      navigate('/signin')
    }
    if(!user){
      getUser()
    }

    if(exams_id){
      getCorrection(exams_id)
    }
    
  }, [])


  // @ ***********************
  useEffect(() => {
    
    if(subjectCollection.length > 0){
        const subject = subjectCollection[0]

        const subjectListSet = correctionQuestions.filter((item) => item.subject === subject);
    
        if(subjectListSet.length > 0){
          setActiveSubjectQuestions(subjectListSet[0].questions)
        }
        console.log(subjectListSet)
    }
 
  }, [correctionQuestions])


  useEffect(() => {
    setActiveSubject(subjectCollection[0])
  }, [subjectCollection])


  //  - - - - - - - - - - - - - -
  useEffect(() => {
    if(activeSubjectQuestions.length > 0){
      setSingleQuestion(activeSubjectQuestions[0])
      console.log(activeSubjectQuestions[0])
    }
   
  }, [activeSubjectQuestions])

  // - - - - - -  - - - -- - - - 
   // ****************************
  //@Set the single answer active
  useEffect(() => {
    if(singleQuestion){
        const singleQueId = singleQuestion && singleQuestion.question_id
        const singleAns = correctionAnswers.filter((item) => parseInt(item.question_id) === singleQueId) 

        setSingleAnswer(singleAns ? singleAns : null)
    }
  },[singleQuestion])

  
  useEffect(() => {
    if(singleQuestion){
      const singleQueId = singleQuestion && singleQuestion.question_id
      const singleAns = correctionAnswers.filter((item) => parseInt(item.question_id) === singleQueId) 
      setSingleAnswer(singleAns ? singleAns : null)
    }
  }, [correctionAnswers])


    
  // ********************************
  // @ONLOAD ID SET SINGLE QUESTION
  useEffect(() => {
    updateAnswersCheck()
 
   },[singleAnswer])


  //  - - - - - -  - - - - - - - - -
  // RENDER MATHS EQUATIONS
  const renderMath = (text) => {
    const eqPattern = /<eq>(.*?)<\/eq>/g;
    const parts = [];
    let lastIndex = 0;
  
    text.replace(eqPattern, (match, p1, offset) => {
      // Add text before the match
      if (offset > lastIndex) {
        parts.push(text.slice(lastIndex, offset));
      }
      // Add the LaTeX expression
      parts.push(<InlineMath key={offset} math={p1} />);
      // Update the last index
      lastIndex = offset + match.length;
    });
  
    // Add remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
  
    return parts;
  };

  //  - - - - - - - - - - - - - - -  - -  
  //  - - - - - - - - - - - - - - -  - -  
  const selectSubject = (subject) => { 
    setSingleIndex(0)

    setActiveSubject(subject)
    const subjectListSet = correctionQuestions.filter((item) => item.subject === subject);

    const answersActive = correctionAnswers.filter((item) => item.subject === subject);
    setActiveAnswers(answersActive);
    updateAnswersCheck(answersActive)

    setActiveSubjectQuestions(subjectListSet[0].questions)
    getBgColor()

  }

    //  - - - - - - -  - - - - - - - - - - - - - - - - - - - - -
  // MAKES SURE THAT THE CORRECT ANSWER HAS BEING HIGHTLIGHTED
  const updateAnswersCheck = () => {
    // Ensure singleAnswer is not null and has at least one element
    if (singleAnswer && singleAnswer.length > 0) {
      const answer = singleAnswer[0];
      // Ensure answer is defined and has a question_id
      const questionId = answer && answer.question_id ? answer.question_id : null;
      const selectedAnswer = answer && answer.selected_answer ? answer.selected_answer : null;
      const correctAnswer = activeSubjectQuestions.filter((item) => item.question_id === parseInt(questionId))
      const correctAnswerOption = correctAnswer[0].answer_value
    

      if (questionId && selectedAnswer) {
        // console.log(selectedAnswer);
  
        // Find the ul element for the current question_id
        const ulElement = document.querySelector(`ul[question_id="${questionId}"]`);
        if (ulElement) {
          // console.log(ulElement);
          // Find all checkboxes within the ul element
          const checkboxes = ulElement.querySelectorAll('input[type="checkbox"]');
  
          checkboxes.forEach(checkbox => {
            const parentLi = checkbox.closest('li'); // Get the closest li element
  
            if (checkbox.value === selectedAnswer) {
              checkbox.checked = true;

              
              if(selectedAnswer !== correctAnswerOption){
                  parentLi.style.backgroundColor = '#fecaca';
              }else {
                  parentLi.style.backgroundColor = '#d1fae5'; // Apply background color  
              }

            } else {
              checkbox.checked = false;
              parentLi.style.backgroundColor = ''; // Reset background color
            }
          });
        }
      } else {
        // console.log('Question ID or selected answer is missing');
      }
    } else {
      // console.log('singleAnswer is null or empty');
    }
  };


  // @Select single Question using the index
  const selectSingleIndex = (index) => {
    const singleQue = activeSubjectQuestions[index]
    setSingleQuestion(singleQue)
    setSingleIndex(index)
    updateAnswersCheck()
    // console.log(singleQue)
  }

  // @SETS THE BG GREEN FOR ANSWERED QUESTIONS - - -  - - - - - -
  const getBgColor = (index, question_id) => {
    const userAnswer = correctionAnswers.find(answer => +answer.question_id === question_id);
    const selectedAnswer = userAnswer && userAnswer.selected_answer
    const correctAnswer = activeSubjectQuestions.filter((item) => item.question_id === parseInt(question_id))
    // console.log(correctAnswer)
    const correctAnswerOption = singleAnswer !== null ? correctAnswer[0].answer_value : '';

    // console.log(correctAnswerOption, selectedAnswer)

    return correctAnswerOption === selectedAnswer ? 'border-r-4 border-green-400 text-gray-800' : 'border-r-3 border-red-400 text-gray-800';
    // return userAnswer && userAnswer.selected_answer !== '' ? 'bg-gradient-to-r from-green-700 to-green-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }

    // @SHOW THE NEXT AND PREVIOUS BUTTON {}
    const showPreviousQuestion = () => {

      setSingleQuestion(activeSubjectQuestions[singleIndex-1])
      setSingleIndex(singleIndex-1)
    }
  
    const showNextQuestion = () => {
      setSingleQuestion(activeSubjectQuestions[singleIndex+1])
      setSingleIndex(singleIndex+1)
    }
  

  return (
    <>
      {loading && <Spinner />}
      <div className="overal body w-full">
      <div className="flex justify-between items-center px-3 py-1">
        <p className="font-bold block">Exams Correction</p>
        <NavLink to='/performace-history'>
          <button className="bg-red-50 hover:bg-red-100 hover:text-red-600 text-red-500 p-2 px-3 rounded font-semibold text-sm space-grotesk">
            Exit
          </button>
        </NavLink>
      </div>
       
       <div className="flex items-center px-2 py-1 justify-between">          
          <div className="cta-dash-body w-full flex justify-between items-center">
          <div className="subject-select-container flex items-center text-base md:text-base overfloy-x-scroll gap-2 md:gap-2">
              {subjectCollection.length === 0 ? (
                <>Loading...</>
              ) : (
                subjectCollection.map((item, index) => (
                  <div onClick={() => selectSubject(item)} key={index} value={item} className={`flex hover:bg-gray-200  ${activeSubject === item ? 'bg-gray-800 text-gray-50 hover:text-gray-800 hover:bg-gray-900 hover:text-gray-50' : 'bg-gray-50 text-gray-800'} cursor-pointer rounded-lg items-center`}>
                    <span className="p-1 md:p-2 uppercase text-sm font-semibold">{item === 'ENGLISH LANGUAGE' ? 'ENG LANG' : item}</span>
                  </div>
                ))
              )}
            </div>
            {/* <div className="full-flex gap-2">
              <NavLink to='/performace-history'>
                <button className="bg-gray-800 hover:bg-gray-900 hover:text-red-600 text-red-400 border border-gray-950 p-2 px-3 rounded font-semibold font-mono text-sm">
                  Exit
                </button>
              </NavLink>
            </div> */}
          </div>
        </div>
      </div> 
      {/*  */}
      {/* MAIN EXAM SECTION */}
      
      <section className="w-11/12 gap-1 md:w-11/12 p-0 m-auto mt-1 md:p-5 m-auto flex flex-col-reverse md:flex md:flex-row items-start">
        <div className="border m-auto w-full p-1">
          <div className="question-container ">
            <div id='questions-body' className="questions-body w-full pr-2">
            {singleQuestion === null ? (
                'Loading ...'
              ) : (
                  <div key={singleQuestion && singleQuestion.question_id} className="questions-single bg-gray-50 rounded p-2 mt-1">
                    <div className="question-header">
                      <p className="text-gray-500">                     
                        Question <span>{singleIndex + 1}</span>                      
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {/* {singleQuestion && singleQuestion.question_value} */}
                        {singleQuestion && (activeSubject === 'MATHEMATICS' ? renderMath(singleQuestion.question_value) : singleQuestion.question_value)}
                       
                      </p>
                      
                    </div>
                    <div className="options-body mt-3">
                      <ul question_id={singleQuestion && singleQuestion.question_id} >
                        {singleQuestion && singleQuestion.options.map((option, optionIndex) => (
                          <li key={optionIndex} question_id={singleQuestion && singleQuestion.question_id} className="w-full bg-gray flex items-center p-1 mt-1 hover:bg-green-100">
                            <span className="pr-1 flex items-center">
                              <input
                                question_id={singleQuestion && singleQuestion.question_id}
                                id='option-check'
                                type="checkbox"
                                disabled
                                // value={option}
                                value={option}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </span>
                            <p>{activeSubject === 'MATHEMATICS' ? renderMath(option) : option}</p>
                            <p></p>
                          </li>
                        ))}
                      </ul>
                      <p className="flex items-center gap-2 p-1.5 border border-green-300 mt-2 bg-gray-100 shadow">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-green-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        {singleQuestion && singleQuestion.answer_value}</p>
                      <div className="flex w-full items-center text-center justify-around mt-2 bg-gray-50 p-3 gap-3">
                       
                       { singleIndex === 0 ? '' : (
                        <button onClick={showPreviousQuestion} id='previous-questions' index={singleIndex} question_id={ singleQuestion && singleQuestion.question_id} className='bg-gray-900 text-white hover:bg-gray-800 p-2 px-3 rounded-full font-sans text-sm font-semibold'>Previous</button>)}
                       {activeSubjectQuestions.length === singleIndex+1 ? '' : (
                        <button onClick={showNextQuestion} id='next-questions' index={singleIndex} question_id={ singleQuestion && singleQuestion.question_id} className='bg-gray-900 text-white hover:bg-gray-800 p-2 px-3 rounded-full font-sans text-sm font-semibold'>Next</button>
                       )}
                        
                      </div>  
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions Index */}
        <div className="questions-index-container w-full md:w-40">
          <div className="question-index-body text-sm w-full grid grid-cols-10 md:w-40 md:grid-cols-4 gap-0.5 text-gray-100 p-1 rouded max-h-[100px] overflow-y-scroll md:max-h-[400px]">
            {activeSubjectQuestions.map((item, index) => (
              <span
                onClick={() => selectSingleIndex(index)}
                index_value={index + 1}
                key={index}
                href={`#num${index + 1}`}
                className={`cursor-pointer border border-gray-50 rounded ${getBgColor(index, item.question_id)} flex items-center justify-center question-index-number w-full gap-1 h-8`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* MAIN EXAM SECTION */}
      {/*  */}
    </>
  )
}

export default Correction