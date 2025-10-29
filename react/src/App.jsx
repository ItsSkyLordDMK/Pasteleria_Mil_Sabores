import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import Admin from './pages/Admin'

function App() {
  return (
    <>
      <Navbar/>
      <div className='container mt-4'>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/admin' element={<Admin/>}></Route>
          {/*<Route path='/login' element={<Login/>}></Route>*/}
        </Routes>
      </div>
    </>
  )
}

export default App
