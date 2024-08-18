/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { UserContext } from '../context/user/UserContext'
import { SubjectCombinationContext } from '../context/subjectCombination/SubjectCombinationContext'
import { ExamContext } from '../context/Exams/ExamContext';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const ExamsActive = () => {
  const token = localStorage.getItem('auth_cbt_token');
  const navigate = useNavigate();

  const { user, getUser, loginStatus, setPageUrl, pageUrl } = useContext(UserContext)
  const { subjectSet } = useContext(SubjectCombinationContext)
  const { examDetails, 
          allGeneralQuestions, 
          userAnswersList, 
          loading, 
          submitted,
          getActiveExam, 
          getSelectedAnswers, 
          subjectCollection,
          setUserAnswersList,
          confirmSubmitExam,
          makeAnswerPost} = useContext(ExamContext)

  const [activeSubject, setActiveSubject] = useState('');
  const [activeSubjectQuestions, setActiveSubjectQuestions] = useState([]);
  const [activeAnswers, setActiveAnswers] = useState([])
  const [activeIndex, setActiveIndex] = useState('bg-gray-700')

  const [singleQuestion, setSingleQuestion] = useState(null)
  const [singleAnswer, setSingleAnswer] = useState(null)
  const [singleIndex, setSingleIndex] = useState(0)

  const [countDown, setCountDown] = useState('0:0:0')
  setPageUrl(location.pathname)
  

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    } 

    if(user === null){
      getUser()
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  
  useEffect(() => {
    if (user) {
      getActiveExam(user.user_id);

    }
  }, [user]); // This runs only when user.user_id changes

  
  useEffect(() => {
    if(loginStatus === false){
      navigate('/signin')
    }
  }, [loginStatus])

  
  // @ ***********************
  useEffect(() => {
    
    if(subjectCollection.length > 0){
        const subject = subjectCollection[0]

        const subjectListSet = allGeneralQuestions.filter((item) => item.subject === subject);
    
        if(subjectListSet.length > 0){
          setActiveSubjectQuestions(subjectListSet[0].questions)
        }
        // console.log(subjectListSet)
    }
 
  }, [allGeneralQuestions])

  // 
  useEffect(() => {
    setActiveSubject(subjectCollection[0])

  }, [subjectCollection])


  // ***************************
  // @Set the active Single Question after selecting a Subject 
  useEffect(() => {

    setSingleQuestion(activeSubjectQuestions[0])

  }, [activeSubject, activeSubjectQuestions])


  // ****************************
  //@Set the single answer active
  useEffect(() => {
    if(singleQuestion){
        const singleQueId = singleQuestion && singleQuestion.question_id
        const singleAns = userAnswersList.filter((item) => parseInt(item.question_id) === singleQueId) 

        setSingleAnswer(singleAns ? singleAns : null)
    }
  },[singleQuestion])

  useEffect(() => {
    if(singleQuestion){
      const singleQueId = singleQuestion && singleQuestion.question_id
      const singleAns = userAnswersList.filter((item) => parseInt(item.question_id) === singleQueId) 
      setSingleAnswer(singleAns ? singleAns : null)
    }
  }, [userAnswersList])


  
  // ********************************
  // @ONLOAD ID SET SINGLE QUESTION
  useEffect(() => {
   updateAnswersCheck()

  },[singleAnswer])


  // ************************
  // @ Checks if the Submition was a Success
  // then navigate to the history page
  useEffect(() => {
    if(submitted === true){
      navigate('/performace-history')
    }
  }, [submitted])

  
  // ************************
  // @ Exam Countdown
  // Call it and make sure the counting continue
  useEffect(() => {
    if(examDetails){
      const timeSet = examDetails.allocated_time
      const startedTime = examDetails.created_at
    }
    
  }, [activeSubjectQuestions])



  // ***************************
  // ***************************
  const selectSubject = (subject) => { 
    setSingleIndex(0)

    setActiveSubject(subject)
    const subjectListSet = allGeneralQuestions.filter((item) => item.subject === subject);

    const answersActive = userAnswersList.filter((item) => item.subject === subject);
    setActiveAnswers(answersActive);
    updateAnswersCheck(answersActive)

    setActiveSubjectQuestions(subjectListSet[0].questions)
    getBgColor()

  }

  // ***************************
  const optionPick = (e, question_id, option) => {
    // e.target.checked = true
    // @declare the selected options details 
    const answerObj = {
      question_id,
      selected_answer: option,
      exams_id: examDetails.exams_id,
      user_id: examDetails.user_id,
      subject: activeSubject
    }
    // setUserAnswersList((prevSate) => [
    //   ...prevSate,
    //   answerObj
    // ])
    // updateAnswersCheck([answerObj])
    makeAnswerPost(answerObj);

    //  e.target.checked = true;
    const ulElement = e.target.closest('ul');
    const checkboxes = ulElement.querySelectorAll('input[type="checkbox"]')
    // console.log(checkboxes)
     //@ Ensure the clicked checkbox is checked
   
    checkboxes.forEach(checkbox => {
      const parentLi = checkbox.parentElement.parentElement;
        if (checkbox.value !== option) {
            checkbox.checked = false;
            parentLi.classList.remove('checked-bg'); // Remove bg class from unchecked checkboxes
        } else {
            //@ Ensure the clicked checkbox is checked
          //  e.target.checked = true;
            parentLi.classList.add('checked-bg'); // Add bg class to the checked checkbox
        }
    })

  }


  const updateAnswersCheck = () => {
    // Ensure singleAnswer is not null and has at least one element
    if (singleAnswer && singleAnswer.length > 0) {
      const answer = singleAnswer[0];
      // Ensure answer is defined and has a question_id
      const questionId = answer && answer.question_id ? answer.question_id : null;
      const selectedAnswer = answer && answer.selected_answer ? answer.selected_answer : null;
  
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
              parentLi.style.backgroundColor = '#d1fae5'; // Apply background color
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
    const userAnswer = userAnswersList.find(answer => +answer.question_id === question_id);
    return userAnswer && userAnswer.selected_answer !== '' ? 'bg-gradient-to-r from-green-700 to-green-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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


  const submitExam = () => {  
      const confirmSubmit = window.confirm('Are you sure you want to submit')

      if(confirmSubmit){
        confirmSubmitExam({user_id: user.user_id, exams_id: examDetails.exams_id})
      }
  }


  useEffect(() => {
    if (examDetails && singleQuestion) {
      const timeSet = examDetails.allocated_time; // in minutes
      const startedTime = new Date(examDetails.created_at); // starting time
      const endTime = new Date(startedTime.getTime() + timeSet * 60 * 1000);

      const updateCountDown = () => {
        const now = new Date();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          setCountDown(`${hours}:${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
          console.log(seconds)
        } else {
          clearInterval(interval);
          setCountDown("Time's up!");
          confirmSubmitExam({exams_id: examDetails.exams_id, user_id: user.user_id})
        }
      };

      const interval = setInterval(updateCountDown, 1000);
      updateCountDown(); // initialize immediately

      return () => clearInterval(interval); // cleanup on unmount
    }
  }, [examDetails]);

  // ************************************************
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


  const inlineFormula = "<eq>\\textit{number}</eq>";
 
  // const newForm = "Find the derivative of \n2^5 (cos(θ) + sin(θ^2)) with respect to";

  // const newForm2 = "Differentiate <eq> (\\cos \\theta + \\sin \\theta)^2</eq> with respect to <eq>\\theta</eq>";



  return (
    <>
      <div className="w-full">
       { <img src="../question-images/993838939383940896.png" alt="" /> }
       {/* { renderMath(inlineFormula) } */}
      {/* <InlineMath math={inlineFormula} /> */}

      {/* <BlockMath math={blockFormula} /> */}
        {loading && <Spinner />}
        <div className="flex items-center p-1 py-3 justify-between border border-gray-200">
          <div className="cta-dash-body w-full flex justify-between items-center">
            <div className="subject-select-container text-xs full-flex gap-2">
              {subjectCollection.length === 0 ? (
                <>Loading...</>
              ) : (
                subjectCollection.map((item, index) => (
                  <div onClick={() => selectSubject(item)} key={index} value={item} className={`flex hover:bg-gray-200 border ${activeSubject === item ? 'bg-gray-800 text-gray-50 hover:bg-gray-900 hover:text-gray-50' : 'bg-gray-50 text-gray-800'} cursor-pointer rounded-full items-center`}>
                    <span className="p-1 md:p-2 uppercase text-xs tiny-font">{item}</span>
                  </div>
                ))
              )}
            </div>

            <div className="full-flex gap-2">
              <div id="timing-box" className="font-semibold">
                <div id="count-down" className="countdown font-mono text-sm md:text-lg flex">{countDown}</div>   
              </div>
              <button onClick={submitExam} className="bg-gray-100 hover:bg-red-500 hover:text-white text-red-600 border border-red-400 p-2 px-3 rounded font-semibold text-sm">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="h-screen w-11/12 gap-1 md:w-11/12 p-0 m-auto mt-1 md:p-5 m-auto flex flex-col-reverse md:flex md:flex-row items-start">
        <div className="border m-auto w-full p-1">
          <div className="question-container ">
            <div id='questions-body' className="questions-body w-full pr-2">
            {singleQuestion === null ? (
                'Loading ...'
              ) : (
                  <div key={singleQuestion && singleQuestion.question_id} className="questions-single bg-gray-50 rounded p-2 mt-1">
                    <div className="question-header">
                      <p className='font-bold text-gra-950'>
                        {singleQuestion && activeSubject === 'ENGLISH LANGUAGE' && singleQuestion.comprehension_title ? singleQuestion.comprehension_title : ''}
                      </p>
                      <p className='text-base text-black'>
                        {singleQuestion && activeSubject === 'ENGLISH LANGUAGE' && singleQuestion.comprehension ? singleQuestion.comprehension : ''}
                      </p>
                      <p className="text-gray-500 text-base">
                        Question <span>{singleIndex + 1}</span>
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {/* {singleQuestion && singleQuestion.question_value} */}
                        {singleQuestion && renderMath(singleQuestion.question_value) }                       
                      </p>
                      
                    </div>
                    <div className="options-body mt-3 text-black text-sm md:text-base">
                      <ul question_id={singleQuestion && singleQuestion.question_id} >
                        {singleQuestion && singleQuestion.options.map((option, optionIndex) => (
                          <li key={optionIndex} question_id={singleQuestion && singleQuestion.question_id} className="w-full bg-gray flex items-center p-1 mt-1 hover:bg-green-100">
                            <span className="pr-1 flex items-center">
                              <input
                                question_id={singleQuestion && singleQuestion.question_id}
                                id='option-check'
                                type="checkbox"
                                // value={option}
                                value={option}
                                onClick={(e) => optionPick(e, singleQuestion && singleQuestion.question_id, option)}
                                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                              />
                            </span>
                            <p>{renderMath(option)}</p>
                            {/* <p>{<InlineMath math={newForm2.replace(/\\\(/g, '').replace(/\\\)/g, '')} />}</p> */}
                          </li>
                        ))}
                      </ul>
                      <div className="flex w-full items-center text-center justify-around mt-2 bg-gray-50 p-3 gap-3">
                       
                       { singleIndex === 0 ? '' : (
                        <button onClick={showPreviousQuestion} id='previous-questions' index={singleIndex} question_id={ singleQuestion && singleQuestion.question_id} class='bg-gray-900 text-white hover:bg-gray-800 p-2 px-3 rounded-full font-sans text-xs font-semibold'>Previous</button>)}
                       {activeSubjectQuestions.length === singleIndex+1 ? '' : (
                        <button onClick={showNextQuestion} id='next-questions' index={singleIndex} question_id={ singleQuestion && singleQuestion.question_id} class='bg-gray-900 text-white hover:bg-gray-800 p-2 px-3 rounded-full font-sans text-xs font-semibold'>Next</button>
                       )}
                        
                      </div>  
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions Index */}
        <div className="questions-index-container">
          <div className="question-index-body text-sm w-72 grid grid-cols-10 md:w-40 md:grid-cols-4 gap-0.5 text-gray-100 p-1 rouded">
            {activeSubjectQuestions.map((item, index) => (
             
              <span
                onClick={() => selectSingleIndex(index)}
                index_value={index + 1}
                key={index}
                href={`#num${index + 1}`}
                className={`cursor-pointer border rounded ${getBgColor(index, item.question_id)} flex items-center justify-center question-index-number`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExamsActive;
