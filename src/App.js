// import PrivateRoute from './components/PrivateRoute';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// // import PrivateRoute from './components/PrivateRoute';
// import Home from './pages/Home';
// import Editorpage from './pages/EditorPage'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// function App() {
//   return (
//     <BrowserRouter>
// <Routes>
//     {/* Public routes */}
//     <Route path="/login" element={<LoginPage/>} />
//     <Route path="/register" element={<RegisterPage/>} />

//     {/* Protected routes */}
//     <Route
//         path="/"
//         element={
//             <PrivateRoute>
//                 <Home/>
//             </PrivateRoute>
//         }
//     />
//     <Route
//         path="/editor/:roomId"
//         element={
//             <PrivateRoute>
//                 <Editorpage/>
//             </PrivateRoute>
//         }
//     />
// </Routes>
// </BrowserRouter>
//   )}
//   export default App;


// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import RegisterPage from './pages/RegisterPage'; // Adjust the path as needed
// import LoginPage from './pages/LoginPage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<LoginPage/>} />
//         <Route path="/register" element={<RegisterPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import "core-js-pure/stable/object/assign";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';



function App() {
    return (
        <>
            <div> 
                 <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                
                    <Route path="/register" element={<RegisterPage/>}></Route>
                    <Route path="/login" element={<LoginPage/>}></Route>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor/:roomId"
                        element={<EditorPage />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;


//-----------------------------------
// src/App.js
// import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import Home from './pages/Home';
// import EditorPage from './pages/EditorPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import "core-js-pure/stable/object/assign";
// import PrivateRoute from './components/PrivateRoute';

// function App() {
//     return (
//         <>
//             <div>
//                 <Toaster
//                     position="top-right"
//                     toastOptions={{
//                         success: {
//                             theme: {
//                                 primary: '#4aed88',
//                             },
//                         },
//                     }}
//                 />
//             </div>
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/editor/:roomId" element={<EditorPage />} />
//                     <Route path="/login" element={<LoginPage />} />
//                     <Route path="/register" element={<RegisterPage />} />
//                 </Routes>
//             </BrowserRouter>
//         </>
//     );
// }

// export default App;



