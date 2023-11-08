import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import { Login, Home, Public } from './pages/public'
import path from './ultils/path'
import { getCategories } from './store/asyncAction'
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCategories())
  }, [])
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path={path.PUBLIC} element={< Public></Public>}>
          <Route path={path.HOME} element={<Home></Home>} />
          <Route path={path.LOGIN} element={<Login></Login>} />


        </Route>
      </Routes>
    </div>
  );
}

export default App;
