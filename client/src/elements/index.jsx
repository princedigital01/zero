import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams , useNavigate} from 'react-router-dom';
import ip from "../var";


function Index() {
  const [info, setInfo]=useState({});
  const [data, setData]=useState({});
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const {token}= useParams();
  const navigate=useNavigate();

  useEffect(()=>{
    axios.post(ip+'/index_data', {token: token,}).then((res) => {
        
      if(res['data']['message']=='sucessfull') {
        setInfo(res['data']);
      }else if(res['data']['message']=='no response found'){
        //navigate("/login");
        setWarning('no response found');
      }
      setWarning('');
      
    }).catch((err) => { setWarning("sorry something went wrong"+err) })
  },[])

  function clicked(){
    axios.post(ip+'/coin', {token: token,}).then((res) => {
        
      if(res['data']['message']=='sucessfull') {
        setInfo({...info, coins:res['data'].coins});

      }else{
        //navigate("/login");
        setWarning('no response found');
      }
      setWarning('');
      
    }).catch((err) => { setWarning("sorry something went wrong"+err) })
   
  }

  window.onkeydown=(e)=>{
    e.preventDefault();
    if(e.code == 'Enter' || e.code=='Space') clicked()
  }


  return (
    <div className='index'> 
      <div className='contain'>
        <p>{warning}</p>
        <h4>welcome {info['firstname']}</h4>
        <h2>{info['coins']}</h2>
        <img src='/icon.png' onClick={()=>clicked()} className='logo'/>
        <h1>zero-app</h1>
        

      </div>
    </div>
  )
}

export default Index