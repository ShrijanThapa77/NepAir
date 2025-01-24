import React from 'react'
import { useNavigate } from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();

    const goToHome = (e) => {
      e.preventDefault();
      navigate("/Home");
    };
  
  return (
    <>
    <div className='homebtn'>
    <form onSubmit={goToHome}>
        <input type="submit" value="Go to Home" />
    </form>
    </div>
        <div className='loginForm'> 
    <form>
    <h1>Login</h1>
  <div className="mb-3">
    <label for="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1"/>
  </div>
  <div className='btnform'>
  <button type="submit" className="btn btn-success">Submit</button>
  </div>
</form>
    </div>
    </>
  )
}

export default Login
