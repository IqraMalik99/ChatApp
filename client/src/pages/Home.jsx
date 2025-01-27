import React from 'react'
import Header from '../components/Header/Header.jsx'
import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { userState, userLogout} from '../store/reducer.js';

function Home({children}) {
  let dispatch = useDispatch()
  function hasCookieKey(key) {
    const cookies = document.cookie.split('; ');
    return cookies.some(cookie => cookie.startsWith(`${key}=`));
  }
  
  const [hasKey, setHasKey] = useState(false);
  
  useEffect(() => {
    const keyExists = hasCookieKey("accessToken");
    setHasKey(keyExists);
  }, []);
  
  // if(!hasKey){
  //   dispatch(userState(null));
  //   dispatch(userLogout());
  //  }
  return (
    <div>
     <Header/>
     <main>{children}</main>
    </div>
  )
}

export default Home
// component tell font render as html tag  .. for seo
// variant it looks like h1,h2... tag not for ender as h1 ... not for seo

//