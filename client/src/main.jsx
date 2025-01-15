import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Ensure to import BrowserRouter
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.js';
import { SocketProvider } from './socket.jsx';
// import UserModel from './components/UserModel.jsx';


// Lazy loaded components
let Home = lazy(() => import('./pages/Home.jsx'));
let About = lazy(() => import('./pages/About.jsx'));
let SignIn = lazy(() => import('./pages/SignIn.jsx'));
let SignUp = lazy(() => import('./pages/SignUp.jsx'));
let Chats = lazy(() => import('./pages/Chats.jsx'));
let GroupChat = lazy(() => import('./pages/GroupChat.jsx'));
let SignOut = lazy(() => import('./pages/SignOut.jsx'));
let Friends = lazy(() => import('./components/Friends.jsx'));
createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <CssBaseline />
          <BrowserRouter> {/* Wrap everything inside BrowserRouter */}
            <Suspense fallback={<div>Loading...</div>}>
             <Home>
             <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="about" element={<About />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="friends" element={<Friends />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-out" element={<SignOut />} />
                <Route path="chats/:id" element={<Chats />} />
                <Route path="group-chat" element={<GroupChat />} />
              </Routes>
             </Home>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </SocketProvider>
);
