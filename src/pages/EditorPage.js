// import React, { useState, useRef, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import ACTIONS from '../Actions';
// import Client from '../components/Client';
// import "core-js-pure/stable/object/assign";
// import Editor from '../components/Editor';
// import { initSocket } from '../socket';
// import {
//     useLocation,
//     useNavigate,
//     Navigate,
//     useParams,
// } from 'react-router-dom';

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const codeRef = useRef(null);
//     const location = useLocation();
//     const { roomId } = useParams();
//     const reactNavigator = useNavigate();
//     const [clients, setClients] = useState([]);

//     useEffect(() => {
//         const init = async () => {
//             socketRef.current = await initSocket();
//             socketRef.current.on('connect_error', (err) => handleErrors(err));
//             socketRef.current.on('connect_failed', (err) => handleErrors(err));

//             function handleErrors(e) {
//                 console.log('socket error', e);
//                 toast.error('Socket connection failed, try again later.');
//                 reactNavigator('/');
//             }

//             socketRef.current.emit(ACTIONS.JOIN, {
//                 roomId,
//                 username: location.state?.username,
//             });

//             // Listening for joined event
//             socketRef.current.on(
//                 ACTIONS.JOINED,
//                 ({ clients, username, socketId }) => {
//                     if (username !== location.state?.username) {
//                         toast.success(`${username} joined the room.`);
//                         console.log(`${username} joined`);
//                     }
//                     setClients(clients);
//                     socketRef.current.emit(ACTIONS.SYNC_CODE, {
//                         code: codeRef.current,
//                         socketId,
//                     });
//                 }
//             );

//             // Listening for disconnected
//             socketRef.current.on(
//                 ACTIONS.DISCONNECTED,
//                 ({ socketId, username }) => {
//                     toast.success(`${username} left the room.`);
//                     setClients((prev) => {
//                         return prev.filter(
//                             (client) => client.socketId !== socketId
//                         );
//                     });
//                 }
//             );
//         };
//         init();
//         return () => {
//             socketRef.current.disconnect();
//             socketRef.current.off(ACTIONS.JOINED);
//             socketRef.current.off(ACTIONS.DISCONNECTED);
//         };
//     }, []);

//     async function copyRoomId() {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success('Room ID has been copied to your clipboard');
//         } catch (err) {
//             toast.error('Could not copy the Room ID');
//             console.error(err);
//         }
//     }

//     function leaveRoom() {
//         reactNavigator('/');
//     }

//     if (!location.state) {
//         return <Navigate to="/" />;
//     }

//     return (
//         <div className="mainWrap">
//             <div className="aside">
//                 <div className="asideInner">
//                     <div className="logo">
//                         <img
//                             className="logoImage"
//                             src="/code-sync.png"
//                             alt="logo"
//                         />
//                     </div>
//                     <h3>Connected</h3>
//                     <div className="clientsList">
//                         {clients.map((client) => (
//                             <Client
//                                 key={client.socketId}
//                                 username={client.username}
//                             />
//                         ))}
//                     </div>
//                 </div>
//                 <button className="btn copyBtn" onClick={copyRoomId}>
//                     Copy ROOM ID
//                 </button>
//                 <button className="btn leaveBtn" onClick={leaveRoom}>
//                     Leave
//                 </button>
//             </div>
//             <div className="editorWrap">
//                 <Editor
//                     socketRef={socketRef}
//                     roomId={roomId}
//                     onCodeChange={(code) => {
//                         codeRef.current = code;
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };

// export default EditorPage;


import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import ACTIONS from '../Actions'; // import actions if needed for other events

const EditorPage = () => {
    const { roomId } = useParams();
    const [username, setUsername] = useState('');  // Username if needed, could be passed via URL or context
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const isDrawing = useRef(false);
    const prevPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(process.env.REACT_APP_BACKEND_URL);

        // Join the room on connection
        socketRef.current.emit(ACTIONS.JOIN, { roomId, username });

        // Listen for drawing data
        socketRef.current.on('draw', handleDraw);

        // Clean up on component unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId, username]);

    // Start drawing when mouse is pressed
    const handleMouseDown = (e) => {
        isDrawing.current = true;
        prevPos.current = { x: e.clientX, y: e.clientY };
    };

    // Draw on canvas when mouse is moving
    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;

        const { clientX: x, clientY: y } = e;

        // Emit drawing event to the server
        socketRef.current.emit('draw', {
            roomId,
            x,
            y,
        });

        // Draw on local canvas
        drawLine(prevPos.current.x, prevPos.current.y, x, y);

        prevPos.current = { x, y };
    };

    // Stop drawing when mouse is released
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    // Handle drawing from other clients
    const handleDraw = ({ x, y }) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';

        const { x: prevX, y: prevY } = prevPos.current;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        prevPos.current = { x, y };
    };

    // Draw a line on the canvas
    const drawLine = (x1, y1, x2, y2) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    return (
        <div className="editorPageWrapper">
            <h2>Room ID: {roomId}</h2>
            <div className="canvasContainer">
                <canvas
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseOut={handleMouseUp}
                    style={{ border: '1px solid black' }}
                ></canvas>
            </div>
        </div>
    );
};

export default EditorPage;
