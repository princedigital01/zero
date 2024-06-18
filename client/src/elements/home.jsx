import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [load, setLoad] = useState(' ')

  return (
    <div className='home'>
      <div className='contain'>
        <div id='loading' className='loading hide'>
          <img src='loading.gif' className='loading-img'/>
        </div>
        <img src='icon.png' className='logo'/>
        <h1>welcome to zero-app</h1>
        <div>{load}</div>
        
          <Link to='/login'  className='btn btn-lg btn-secondary p-3 m-2 ms-3 login'>LOGIN</Link>
          <Link className='btn btn-lg btn-secondary p-3 m-2 ms-3 signup' to='/create'>CREATE ACCOUNT</Link>
      </div>
    </div>
  )
}

export default Home       