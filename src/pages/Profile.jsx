/* eslint-disable no-unused-vars */
import UserIcon from "../assets/images/user.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import GreenBtn from "../components/GreenBtn";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user/UserContext";

const Profile = () => {

  const { user, getUser, loginStatus, getUserProfile, profileData, setProfileData, loading, handleProfileSubmit  } = useContext(UserContext)

  const [userData, setUserData] = useState({});
  const token = localStorage.getItem('auth_cbt_token');
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    if(!token){
      navigate('/sigin')
    }

    if(user === null){
      getUser()
      console.log('user is null')
    }

  }, [])

  useEffect(() => {
    if(user){
      if(profileData === null){
        getUserProfile(user.user_id)
        console.log('918273893093')
      }
     
    }

    if(user === null){
      navigate('/signin')
    }    
  }, [user])

  
  useEffect(() => {
    if(loginStatus === false){
      navigate('/signin')
    }
  }, [loginStatus])

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const updateProfile = () => {
    handleProfileSubmit(profileData)
  }



  return (
    <>
      <div>
        { loading && <Spinner /> }
        <div className="profile-heading w-full bg-gray-900 p-3 px-5 mb-10 text-gray-100">
          <div className="">
            <img src={UserIcon} alt="User Icon" className="w-12" />
          </div>
          <div>
            <div className="bg-gray-800 md:w-8/12 p-2 mt-3 rounded">
              <h1 className="font-mono text-lg font-bold">BIODATA</h1>
              <input type="text" name="user_id" value={userData.user_id || ''} hidden readOnly />
              <div className="mt-2">
                <label htmlFor="name" className="block text-gray-200 text-sm my-0.5">Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={profileData && profileData.name || ''}
                  placeholder="Name"
                  className="rounded bg-gray-900 p-1.5 w-full outline-none focus:ring focus:border-gray-300"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="email" readOnly className="block text-gray-200 text-sm my-0.5">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={profileData && profileData.email || ''}
                  placeholder="name@gmail.com"
                  className="rounded bg-gray-900 p-1.5 w-full outline-none"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="phone_number" className="block text-gray-200 text-sm my-0.5">Phone</label>
                <input
                  type="number"
                  name="phone"
                  onChange={handleChange}
                  value={profileData && profileData.phone || ''}
                  placeholder=""
                  className="rounded bg-gray-900 p-1.5 w-full"
                />
              </div>
            </div>
            {/* Jamb Information */}
            <div className="bg-gray-800 md:w-8/12 p-2 mt-3 rounded">
              <h1 className="font-mono text-lg font-bold">JAMB INFORMATION</h1>
              <div className="mt-2">
                <label htmlFor="jamb_number" className="block text-gray-200 text-sm my-0.5">Jamb Registration Number</label>
                <input
                  type="text"
                  name="jamb_number"
                  onChange={handleChange}
                  value={profileData && profileData.jamb_number}
                  placeholder=""
                  className="rounded bg-gray-900 p-1.5 w-full outline-none focus:ring focus:border-gray-300"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="jamb_score" className="block text-gray-200 text-sm my-0.5">Jamb Score</label>
                <input
                  type="text"
                  name="jamb_score"
                  onChange={handleChange}
                  value={profileData && profileData.jamb_score || ''}
                  placeholder="0"
                  className="rounded bg-gray-900 p-1.5 w-full outline-none focus:ring focus:border-gray-300"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="faculty" className="block text-gray-200 text-sm my-0.5">Faculty</label>
                <select
                  name="faculty"
                  onChange={handleChange}
                  value={profileData && profileData.faculty || ''}
                  className="text-gray-200 bg-gray-700"
                >
                  <option value={profileData && profileData.faculty}>{profileData && profileData.faculty}</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Life Science">Life Science</option>
                  <option value="Physical Science">Physical Science</option>
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="department" className="block text-gray-200 text-sm my-0.5">Department</label>
                <select
                  name="department"
                  onChange={handleChange}
                  value={profileData && profileData.department || ''}
                  className="text-gray-200 bg-gray-700"
                >
                  <option value={profileData && profileData.department}>{profileData && profileData.department}</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Agric Engineering">Agric Engineering</option>
                </select>
              </div>
            </div>
            <div className="w-8/12 mt-3 rounded">
              <GreenBtn text={'Save Update'}  onClick={updateProfile}/>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Profile;
