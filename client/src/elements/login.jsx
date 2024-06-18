import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ip from "../var";


function Login() {
  const navigate = useNavigate();
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [values, setValues] = useState({
    password: '',
    email: '',
  });



  function handleSubmit(e) {
    e.preventDefault();

    axios.post(ip+'/user_login', values).then((res) => {

      if (res['data']['message'] == 'sucessfull') {
        navigate(`/index/${res['data']['token']}`);

      }else{
        
      setWarning(res['data']['message']);
      }
      setSuccess(res['data']['message']);
      setWarning('');

    }).catch((err) => { console.log(err); setWarning("sorry something went wrong") })
  }
  return (
    <div className='login-con  bg-secondary'>

      <form className='login-form' onSubmit={handleSubmit}>
        <h2>create </h2>
        <b className='text-danger bg-highlight-warning'>{warning}</b>
        <b className='text-success bg-highlight-warning'>{success}</b>
        <div className="form-group my-3"><label htmlFor="email" className="label">email</label><input required type="email" name="email" onChange={(e) => setValues({ ...values, email: e.target.value })} /></div>
        <div className="form-group my-3"><label htmlFor="password" className="label">password</label><input required minLength={4} maxLength={30} type="password" name="password" onChange={(e) => setValues({ ...values, password: e.target.value })} /></div>

        <input className='btn btn-success rounded-pill' type="submit" value="login" />

        <br /><Link to='/create'>create account</Link>
      </form>
    </div>
  )
}

export default Login