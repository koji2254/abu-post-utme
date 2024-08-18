import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/user/UserContext";
import { API_URL_BASE } from "../assets/Proxy";
import Spinner from "../components/Spinner";

const Signup = () => {

  const { signUpUser, message, login, user, getUser, loading } = useContext(UserContext)
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_cbt_token')
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const { name, email, password, password_confirmation } = userData;

  const onchange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const registerUser = (e) => {
    e.preventDefault();

    if (password !== password_confirmation) {
      alert('Passwords do not match');
    } else {
      const url = `${API_URL_BASE}/api/sign-up`;

      const formData = {
        name,
        email, 
        password,
        password_confirmation
      }
      signUpUser(url, formData)
    }
  };

  // *************************
  useEffect(() => {
    
    if(login){
      navigate('/')
    }
    
  }, [message, login, navigate])

  useEffect(() => {
    if(token){
      getUser()
    }

    if(user !== null){
      navigate('/')
    }
  },[user])

  // if(isLoading) {
  //   return <Spinner />
  // }

  return (
    <>
      {loading && <Spinner />}
      <div className="w-full bg-gray-50">
      <div className="heading w-10/12 sm:10/12 m-auto text-center pt-5">
        <p className="font-mono text-xl text-green-500 font-bold  space-grotesk">Sign In</p>
        <p className="font-semibold text-2xl mt-2 space-grotesk">
          Practice Post UTME Demo Exams
        </p>
      </div>
        <div className="body-form w-80 m-auto sm:10/12 text-center pt-5">
          <form action="" className="text-left" onSubmit={registerUser}>
            <div className="">
              <label htmlFor="name" className="font-bold block text-xs text-gray-600 my-1">Full Name</label>
              <input type="text" name="name" onChange={onchange} value={name} className="p-1.5 border rounded border-gray-400 border-2 w-full"/>
            </div>
            <div className="mt-3">
              <label htmlFor="email" className="font-bold block text-xs text-gray-600 my-1">Email</label>
              <input type="email" name="email" onChange={onchange} value={email} className="p-1.5 border rounded border-gray-400 border-2 w-full"/>
            </div>
            <div className="mt-3">
              <label htmlFor="password" className="font-bold block text-xs text-gray-600 my-1">Password</label>
              <input type="password" name="password" onChange={onchange} value={password} className="p-1.5 border rounded border-gray-400 border-2 w-full"/>
            </div>
            <div className="mt-3">
              <label htmlFor="password_confirmation" className="font-bold block text-xs text-gray-600 my-1">Confirm Password</label>
              <input type="password" name="password_confirmation" onChange={onchange} value={password_confirmation} className="p-1.5 border rounded border-gray-400 border-2 w-full"/>
            </div>
            <div className="mt-3">
              <button type="submit" className="w-full rounded py-2 border-none bg-green-500 text-gray-50 font-mono">
                Register
              </button>
              <p className="mt-1">Already have an account? <NavLink to='/signin' className='text-blue-600 text-sm underline font-semibold'>Sign In</NavLink></p>
            </div>
          </form>
        </div>
      </div> 
    </>
  );
};

export default Signup;
