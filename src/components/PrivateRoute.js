// // src/components/PrivateRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//     const token = localStorage.getItem('token');
//     return token ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem('token'); // Check for token
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
