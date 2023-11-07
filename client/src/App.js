import React from 'react';
import { Route, Routes } from 'react-router-dom'
import { Login, Home, Public } from './pages/public'
import path from './ultils/path'

function App() {
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
