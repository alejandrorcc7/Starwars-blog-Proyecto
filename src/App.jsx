import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './assets/pages/Home'
import Card from './assets/pages/Card'
import Navbar from './assets/components/Navbar'
import NotFound from './assets/pages/NotFound'
import CardProvider from './assets/context/CardProvider'

const App = () => {
  return (
    <CardProvider>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/card' element={<Card />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
    </BrowserRouter>
    </CardProvider>
  )
}

export default App