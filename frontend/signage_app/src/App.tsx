import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import {CreateContentButton,ContentCreator,ContentDisplay} from './features/Content/Content';
import{DeviceSelector} from './features/Core/Core';
import logo from './logo.svg';
import './App.css';
const App = () => {
  return (
    <div>
      <h1>こんにちは</h1>
      <DeviceSelector />
      <ContentDisplay />
      <ContentCreator />
    </div>
);
};
export default App;