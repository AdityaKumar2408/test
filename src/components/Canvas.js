// import React, { useRef, useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const EditorPage = ({ roomId }) => {
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const socketRef = useRef(null);

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [paths, setPaths] = useState({}); // Store paths for all users
//   const [currentPath, setCurrentPath] = useState([]); // Current drawing path
//   const [currentUser, setCurrentUser] = useState(""); // Current user ID

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth * 2;
//     canvas.height = window.innerHeight * 2;
//     canvas.style.width = `${window.innerWidth}px`;
//     canvas.style.height = `${window.innerHeight}px`;

//     const ctx = canvas.getContext("2d");
//     ctx.scale(2, 2);
//     ctx.lineCap = "round";
//     ctx.strokeStyle = "white";
//     ctx.lineWidth = 5;
//     ctxRef.current = ctx;

//     // Connect to socket server
//     socketRef.current = io("http://localhost:5000");

//     // Join the specified room
//     socketRef.current.emit("joinRoom", roomId);

//     // Load existing paths for the room
//     socketRef.current.on("loadPaths", (loadedPaths) => {
//       setPaths(loadedPaths);
//       redrawPaths(loadedPaths);
//     });

//     // Listen for new drawing events from other users
//     socketRef.current.on("drawPath", ({ userId, path }) => {
//       if (userId !== currentUser) {
//         drawReceivedPath(path);
//       }
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [roomId, currentUser]);

//   const redrawPaths = (paths) => {
//     const ctx = ctxRef.current;
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     Object.values(paths).forEach((userPaths) => {
//       userPaths.forEach((path) => {
//         drawReceivedPath(path);
//       });
//     });
//   };

//   const drawReceivedPath = (path) => {
//     const ctx = ctxRef.current;
//     ctx.beginPath();
//     path.forEach(({ x, y }, index) => {
//       if (index === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     });
//     ctx.stroke();
//   };

//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;
//     setIsDrawing(true);
//     setCurrentPath([{ x: offsetX, y: offsetY }]);
//   };

//   const finishDrawing = () => {
//     if (!isDrawing) return;
//     setIsDrawing(false);

//     const updatedPaths = { ...paths };
//     if (!updatedPaths[currentUser]) updatedPaths[currentUser] = [];
//     updatedPaths[currentUser].push(currentPath);

//     setPaths(updatedPaths);

//     socketRef.current.emit("drawPath", {
//       roomId,
//       userId: currentUser,
//       path: currentPath,
//     });

//     setCurrentPath([]);
//   };

//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;

//     const { offsetX, offsetY } = nativeEvent;
//     const newPoint = { x: offsetX, y: offsetY };
//     const updatedPath = [...currentPath, newPoint];

//     setCurrentPath(updatedPath);
//     drawPathSegment(updatedPath);
//   };

//   const drawPathSegment = (path) => {
//     const ctx = ctxRef.current;
//     ctx.beginPath();
//     ctx.moveTo(path[0].x, path[0].y);

//     path.forEach(({ x, y }, index) => {
//       if (index > 0) ctx.lineTo(x, y);
//     });

//     ctx.stroke();
//   };

//   return (
//     <div>
//       <h1>Room ID: {roomId}</h1>
//       <canvas
//         ref={canvasRef}
//         onMouseDown={startDrawing}
//         onMouseUp={finishDrawing}
//         onMouseMove={draw}
//         onMouseLeave={finishDrawing}
//       />
//     </div>
//   );
// };

// export default EditorPage;


import React, { useRef, useState, useEffect } from "react";

const EditorPage = ({ roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const wsRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState({}); // Store paths for all users
  const [currentPath, setCurrentPath] = useState([]); // Current drawing path
  const [currentUser, setCurrentUser] = useState(""); // Current user ID

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;

    // Connect to WebSocket server
    wsRef.current = new WebSocket("ws://localhost:5000");

    wsRef.current.onopen = () => {
      // Join the specified room
      wsRef.current.send(JSON.stringify({
        type: "joinRoom",
        roomId
      }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "loadPaths":
          setPaths(data.paths);
          redrawPaths(data.paths);
          break;
        case "drawPath":
          if (data.userId !== currentUser) {
            // Add the new path to paths state
            setPaths(prevPaths => {
              const newPaths = { ...prevPaths };
              if (!newPaths[data.userId]) newPaths[data.userId] = [];
              newPaths[data.userId].push(data.path);
              return newPaths;
            });
            // Draw only the new path
            drawSinglePath(data.path);
          }
          break;
        default:
          break;
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, currentUser]);

  const redrawPaths = (paths) => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw each user's paths separately
    Object.entries(paths).forEach(([userId, userPaths]) => {
      userPaths.forEach(path => {
        drawSinglePath(path);
      });
    });
  };

  const drawSinglePath = (path) => {
    const ctx = ctxRef.current;
    if (!path || path.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.stroke();
    ctx.closePath();
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    setCurrentPath([{ x: offsetX, y: offsetY }]);
    
    // Start a new path
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Close the current path
    ctxRef.current.closePath();

    // Update paths state
    setPaths(prevPaths => {
      const newPaths = { ...prevPaths };
      if (!newPaths[currentUser]) newPaths[currentUser] = [];
      newPaths[currentUser].push(currentPath);
      return newPaths;
    });

    // Send the completed path through WebSocket
    wsRef.current.send(JSON.stringify({
      type: "drawPath",
      roomId,
      userId: currentUser,
      path: currentPath
    }));

    setCurrentPath([]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    
    // Update current path
    setCurrentPath(prevPath => [...prevPath, newPoint]);

    // Draw the line segment
    const ctx = ctxRef.current;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold mb-4">Room ID: {roomId}</h1>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        className="border border-gray-300"
      />
    </div>
  );
};

export default EditorPage;