/* eslint-disable no-unused-vars */

import { Link } from 'react-router-dom'; // Assuming you're using React Router
import { useState, useEffect } from 'react';
import ErrAlert from '../components/ErrAlert';
import SuccAlert from '../components/SuccAlert';

const About = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null)
  const [succ, setSucc] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here(e.g., send email)
    console.log('Email:', email);
    console.log('Message:', message);
    if((email === '') || (message === '')){
      return setError('Fill all text')
    }

    return setSucc('Message submited: we will get back to you')

  };

  useEffect(() => {

    if(error !== null){
      setTimeout(() => {
        setError(null)
      }, 2000)
    }

    if(succ !== null){
      setTimeout(() => {
        setSucc(null)
      }, 2000)
    }
  }, [error, succ])


  return (
    <>
     {error && <ErrAlert text={error} />}
     {succ && <SuccAlert text={succ} />}
    <div className="w-11/12 md:w-8/12 m-auto space-grotesk mt-10 mb-5">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">The Importance of CBT Exams</h1>
      <p>
        <span className="text-lg font-semibold text-gray-700">Computer-Based Testing (CBT) has revolutionized the way exams are conducted. Here is why CBT exams are crucial:</span>
        <ul className="mt-4 text-base text-black space-grotesk">
          <li className='border-b border-t p-2 rouned'>Efficiency and Accuracy: CBT exams eliminate the need for manual grading, reducing errors and speeding up results.</li>
          <li className='border-b border-t p-2 rouned'>Standardization: CBT ensures a consistent and fair testing environment for all candidates.</li>
          <li className='border-b border-t p-2 rouned'>Accessibility: CBT exams can accommodate candidates with disabilities through various accessibility features.</li>
          <li className='border-b border-t p-2 rouned'>Security: CBT exams are less susceptible to cheating and fraud compared to traditional paper-based exams.</li>
        </ul>
      </p>


      <div className="mt-4 p-4 md:mt-8 md:p-10 border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}  
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
      
    </div>
    <footer className="text-center p-10 bg-gray-950 text-gray-500">
        &copy; 2024
    </footer>
  </>
  );
};

export default About;