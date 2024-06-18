import React, { useState } from 'react';
import axios from 'axios';
import {Link , useNavigate } from 'react-router-dom';
import ip from "../var";

const Create = () => {
  const navigate= useNavigate();
  const [warning, setWarning] = useState('do not use your real password this is a test app');
  const [success, setSuccess] = useState('');
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    password: '',
    password2: '',
    email: '',
    gender: '',
  });
  


  function handleSubmit(e) {
    e.preventDefault();
    if (values.password !== values.password2) {
      setWarning("sorry password dont match");
    } else if(values.gender == ""){
      setWarning("please select a gender");
    } else {

  
      axios.post(ip+'/add_user', values).then((res) => {

        
        if(res['data']['message']=='sucessfull') {
          navigate(`/index/${res['data']['token']}`);
          
        }
        setSuccess(res['data']['message']);
        setWarning('');
        
      }).catch((err) => { console.log(err); setWarning("sorry something went wrong"+err) })
      
    }
  }
  return (
    <div className='create-con  bg-secondary'>

      <form className='create-form' onSubmit={handleSubmit}>
        <h2>create </h2>
        <p id='mass' className='text-danger bg-highlight-warning'>{warning}</p>
        <p className='text-success bg-highlight-warning'>{success}</p>
        <div className="form-group my-1"><label htmlFor="firstname" className="label">firstname</label><input required minLength={3} maxLength={20} type="text" name="firstname" onChange={(e) => setValues({ ...values, firstname: e.target.value })} /></div>
        <div className="form-group my-1"><label htmlFor="lastname" className="label">lastname</label><input required minLength={3} maxLength={20} type="text" name="lastname" onChange={(e) => setValues({ ...values, lastname: e.target.value })} /></div>
        <div className="form-group my-1"><label htmlFor="email" className="label">email</label><input required type="email" name="email" onChange={(e) => setValues({ ...values, email: e.target.value })} /></div>
        <div className="form-group my-1"><label htmlFor="password" className="label">password</label><input required minLength={4} maxLength={30} type="password" name="password" onChange={(e) => setValues({ ...values, password: e.target.value })} /></div>
        <div className="form-group my-1"><label htmlFor="password2" className="label">re-enter password</label><input required minLength={4} maxLength={20} type="password" name="password2" onChange={(e) => setValues({ ...values, password2: e.target.value })} /></div>

        <div className="form-group my-3">
          <label htmlFor="gender" className="label">gender</label>
          <select required name="gender" className='' id="" onChange={(e) => setValues({ ...values, gender: e.target.value })}>
            <option value={undefined}>--select a gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="others">others</option>
          </select>
        </div>

        <input className='btn btn-primary rounded-pill' type="submit" value="create account" />

        <br /><Link to='/login'>login</Link>
      </form>
    </div>
  )
}

export default Create