import React from 'react';
import {BrowserRouter as Router,Routes,Route, BrowserRouter,Outlet} from 'react-router-dom';
import {CreateContentButton,ContentCreator,ContentDisplay} from './features/Content/Content';
import{DeviceSelector} from './features/Core/Core';
import logo from './logo.svg';
import './App.css';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create-content" element={<ContentCreator/>}/>
      </Routes>
    </Router>
);
};
function HomePage(){
  return(
    <div>
      <h1>Home Page</h1>
      <DeviceSelector/>
      <ContentDisplay/>
      <CreateContentButton/>
    </div>
  )
}
export default App;