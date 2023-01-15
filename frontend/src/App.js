import './css/App.css';
import './css/sidebar.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './pages/login';
import { createBrowserHistory  } from 'history';

import Layout from './layout';

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  if(tokenString == 'undefined'){
    return false;
  }else{
    const userToken = JSON.parse(tokenString);
    return userToken;
  }
}

// function setToken(userToken){
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }

function App() {
  const token = getToken();
  const history = createBrowserHistory();

  if(!token) {
    history.push('login');
    return <Login />
  }

  return (
    <div className="App">
      <header className="App-header">
        <Routes history={history}>
          {
            token && <Route path='/login' element={<Login />} />
          }
          <Route path="*" element={<Layout />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
