import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import { Login, Home, Public, FAQ, Services, DetailPitches, Blog, Pitches } from './pages/public'
import path from './ultils/path'
import { getCategories } from './store/app/asyncAction'
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
          <Route path={path.BLOGS} element={<Blog></Blog>} />
          <Route path={path.DETAIL_PITCH__PID__TITLE} element={<DetailPitches></DetailPitches>} />
          <Route path={path.FAQ} element={<FAQ></FAQ>} />
          <Route path={path.OUR_SERVICE} element={<Services></Services>} />
          <Route path={path.PITCHES} element={<Pitches></Pitches>} />
        </Route>
        <Route path={path.LOGIN} element={< Login></Login>}></Route>
      </Routes>
    </div>
  );
}

export default App;
