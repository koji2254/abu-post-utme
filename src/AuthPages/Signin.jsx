import { NavLink, useNavigate, } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import { UserContext } from "../context/user/UserContext";
import { API_URL_BASE } from "../assets/Proxy";

const Signin = () => {
  const { login, loginUser, user } = useContext(UserContext)

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoding] = useState(false);

  const { email, password } = userData;

  const onchange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  // *************************
  const submitLogin = (e) => {
    e.preventDefault();

    if (password === '' || password === null) {
      setIsLoding(false)
      alert('Passwords is Empty');
    } else {
      const url = `${API_URL_BASE}/api/sign-in`;

      const formData = {
        email, 
        password,
      }
      loginUser(url, formData)
    }
  };


  // *************************
  useEffect(() => {

    if(user !== null){
      navigate('/')
    }

  }, [login, navigate, user])


  if(isLoading) {
    return <Spinner />
  }


  return (
    <>
    <div className="w-full h-screen bg-gray-50">
      <div className="heading w-10/12 sm:10/12 m-auto text-center pt-5">
        <p className="font-mono text-xl text-green-500 font-bold  space-grotesk">Sign In</p>
        <p className="font-semibold text-2xl mt-2 space-grotesk">
          Practice Post UTME Demo Exams
        </p>
      </div>
      <div className="body-form w-80 m-auto sm:10/12 text-center pt-5">
        <form action="" className="text-left">
        <div className="mt-3">
              <label htmlFor="email" className="font-bold block text-xs text-gray-600 my-1">Email</label>
              <input type="email" name="email" onChange={onchange} value={email} className="p-1.5 border rounded border-gray-400 border-1 w-full"/>
            </div>
            <div className="mt-3">
              <label htmlFor="password" className="font-bold block text-xs text-gray-600 my-1">Password</label>
              <input type="password" name="password" onChange={onchange} value={password} className="p-1.5 border rounded border-gray-400 border-1 w-full"/>
            </div>
          <div className="mt-3">
            <button onClick={submitLogin} className="w-full rounded py-2 border-none bg-pr-green text-gray-50 font-mono ">
              Login
            </button>
            <p className="text-sm mt-3 nunito">Register new account <NavLink to='/signup' className='tx-pr-green underline font-semibold'>Sign Up</NavLink></p>
          </div>
        </form>
      </div>
    </div> 

    </>
  )
}

export default Signin