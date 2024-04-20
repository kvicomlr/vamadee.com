/* import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; */
import Signup from "../../components/signup/Signup.jsx";

const Register = () => {
 /*  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
    }
  }, []) */
  return (
    <div>
        <Signup />
    </div>
  )
}

export default Register;