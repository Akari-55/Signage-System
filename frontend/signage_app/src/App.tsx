import React from 'react';
import {BrowserRouter as Router,Routes,Route, BrowserRouter,Outlet} from 'react-router-dom';
// import {CreateContentButton,ContentCreator,ContentDisplay,ContentEdit} from './features/Content/Content';
// import{ContentGroupDisplay,CreateContentGroup,CreateContentGroupButton,DigitalSignage,DisplaySignageButton} from './features/Content/ContentGroup';
import Core from './features/Core/Core';
import logo from './logo.svg';
import {Reset} from './globalStyles';
import './App.css';
const App = () => {
  return (

    <Router>
      <Reset/>
    <Core />
    {/* // <Router>
    //   <Routes>
    //     <Route path="/" element={<HomePage/>}/>
    //     <Route path="/create-content" element={<ContentCreator/>}/>
    //     <Route path="/create-content-group"element={<CreateContentGroup/>}></Route>
    //     <Route path="/display" element={<DigitalSignage/>}></Route>
    //     <Route path="/edit/:id" element={<ContentEdit/>}/>
    //   </Routes>
    // </Router> */}
    </Router>
);
};
function HomePage(){
  return(
    <div>
      <h1>Home Page</h1>
      {/* <DeviceSelector/>
      
      <ContentDisplay/> */}
      {/* <CreateContentButton/>
      <ContentGroupDisplay/>
      <CreateContentGroupButton/>
      <DisplaySignageButton/> */}
    </div>
  )
}
export default App;