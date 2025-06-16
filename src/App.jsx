import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {  Routes, Route } from 'react-router-dom'
import Clients from './page/Clients/Clients'
import Home from './page/Home/Home'


const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Clients' element={<Clients/>}/>
      </Routes>
      
    </div>
  )
}

export default App
