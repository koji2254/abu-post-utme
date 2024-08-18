/* eslint-disable react/no-unknown-property */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import GreenBtn from "../components/GreenBtn";

const CreateQuestions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({ subject: "", subject_id: "" });
  const [questionType, setQuestionType] = useState('');
  const [questionStatus, setQuestionStatus] = useState('');
  const [jointedQuestion, setJointedQuestion] = useState('');
  const [questionValue, setQuestionValue] = useState('');
  const [questionOptions, setQuestionOptions] = useState(['', '', '', '', '']);
  const [questionImgUrl, setQuestionImgUrl] = useState(null);
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

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
  };

  const handleInputChange = (e, index) => {
    const newOptions = [...questionOptions];
    newOptions[index] = e.target.value;
    setQuestionOptions(newOptions);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionImgUrl(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitQuestion = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('subject_id', selectedSubject.subject_id);
    formData.append('subject', selectedSubject.subject);
    formData.append('question_value', questionValue);
    formData.append('question_type', questionType);
    formData.append('question_status', questionStatus);
    formData.append('jointed_question', jointedQuestion);
    formData.append('answer_value', questionAnswer);
    formData.append('question_options', questionOptions.join('|||||'));
    
    if (questionImgUrl) {
      formData.append('question_img_url', questionImgUrl);
    }

    setIsLoading(true)
    axios.post('http://127.0.0.1:8000/api/create-question', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(response => {
        setIsLoading(false)
        setQuestionValue('')
        setQuestionOptions(['','','','',''])
        setImagePreviewUrl(null)
        alert('Question created successfully', response.data.message);
        // Handle success response
      })
      .catch(error => {
        setIsLoading(false)
        alert('Failed to create question', error);
        // Handle error response
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="p-2">
        <h1 className="font-bold uppercase text-xl text-gray-800">Upload Question</h1>
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
            <p className="text-bold border rounded">Subject ID: <input type="text" className="border-none font-bold" value={selectedSubject.subject_id} readOnly /></p>
          </div>
        </div>
        <div className="w-full border border-gray-50 p-2">
          {selectedSubject.subject && <span className="font-bold p-1 text-gray-100 bg-gray-900 my-1">{selectedSubject.subject} </span>}

          <div className="md:w-8/12">
            <form onSubmit={submitQuestion}>
              <div className="bg-gray-50 mt-2 p-1">
                <label className="block text-xs font-bold mb-1" htmlFor="">Question Value</label>
                <textarea
                  name="question_value"
                  className="w-full border p-1 border-gray-400 outline-none"
                  id=""
                  value={questionValue}
                  onChange={(e) => setQuestionValue(e.target.value)}
                />
              </div>
              <div className="bg-gray-50 mt-2 p-1 flex gap-2 text-xs md:text-normal">
                <div className="">
                  <label className="block text-xs font-bold mb-1 bg-gray-300 p-1 rounded-full w-32" htmlFor="">Question Type</label>
                  <select
                    name="question_type"
                    id=""
                    className="font-semibold p-1.5 w-full border rounded"
                    // defaultValue={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                  >
                    <option selected disabled>Question type</option>
                    <option value="single">single</option>
                    <option value="family">family</option>
                    <option value="comprehension">comprehension</option>
                  </select>
                </div>
                <div className="">
                  <label className="block text-xs font-bold mb-1 bg-gray-300 p-1 rounded-full w-32" htmlFor="">Question Status</label>
                  <select
                    name="question_status"
                    id=""
                    className="font-semibold p-1.5 border rounded"
                    // defaultValue={questionStatus}
                    onChange={(e) => setQuestionStatus(e.target.value)}
                  >
                    <option selected disabled>Question Status</option>
                    <option value="single">single</option>
                    <option value="parent">parent</option>
                    <option value="child">child</option>
                  </select>
                </div>
                <div className="">
                  <label className="block text-xs font-bold mb-1 bg-gray-300 p-1 rounded-full w-32" htmlFor="">Jointed Question</label>
                  <select
                    name="jointed_question"
                    id=""
                    className="font-semibold p-1 border rounded"
                    // value={jointedQuestion}
                    onChange={(e) => setJointedQuestion(e.target.value)}
                  >
                    <option selected disabled>TRUE/FALSE</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div>
              </div>
              <div className="options-section">
                {questionOptions.map((option, index) => (
                  <div className="flex items-center mt-1" key={index}>
                    <span className="border p-2">{String.fromCharCode(97 + index)}</span> 
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2"
                      name={`question_options[${index}]`}
                      value={option}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                ))}
                <div className="flex items-center mt-1 bg-gray-950 p-2">
                  <span className="bg-gray-900 text-white p-2">
                    answer
                  </span>
                  <input type="text" name="answer" onChange={(e) => setQuestionAnswer(e.target.value)} className="bg-gray-700 border border-gray-200 w-full p-2" />
                </div>
              </div>
              <div className="bg-gray-100 mt-2 p-2">
                <label className="block text-xs font-bold mb-1 bg-gray-300 p-1 rounded-full w-62" htmlFor="">Select Question Image</label>
                <input type="file" name="question_img_url" onChange={handleFileChange} />
                <div className="mt-2">
                {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" />}
                </div>
              </div>
              <div>
                <GreenBtn onClick={submitQuestion} text={'Submit Question'} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateQuestions;
