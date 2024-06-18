import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './elements/home';
import Chat from './elements/chat';
import View from './elements/view';
import Login from './elements/login';
import Index from './elements/index';
import Create from './elements/create';
import './App.css';




const App=()=>{

   return(

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/view/:id' element={<View/>} />
          <Route path='/create' element={<Create/>} />
          <Route path='/index/:token' element={<Index/>} />
        </Routes>
      </BrowserRouter>
    
   );
}

export default App;