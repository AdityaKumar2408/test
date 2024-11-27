// // const express = require('express');
// // const app = express();
// // const http = require('http');
// // const path = require('path');
// // const { Server } = require('socket.io');
// // const ACTIONS = require('./src/Actions');
// // // const dotenv = require('dotenv')
// // // dotenv.config();
// // require('dotenv').config({ path: './.env' });
// // //import "core-js-pure/stable/object/assign";
// // const mongoose = require('mongoose');
// // // dotenv.config();
// // mongoose.Promise = global.Promise;
// // mongoose.connect(process.env.MONGODB_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// // }).then(() => {
// //     console.log('Connected to MongoDB Atlas');
// // }).catch((err) => {
// //     console.error('Error connecting to MongoDB:', err);
// // });
// // const jwt = require('jsonwebtoken');
// // const User = require('./src/models/User'); // Import the User model

// // const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

// // // Middleware to protect routes
// // function authenticateToken(req, res, next) {
// //     const token = req.headers['authorization'];
// //     if (!token) return res.sendStatus(403);

// //     jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
// //         if (err) return res.sendStatus(403);
// //         req.user = user;
// //         next();
// //     });
// // }

// // // Register Route
// // app.post('/register', async (req, res) => {
// //     try {
// //         const { username, password } = req.body;
// //         const user = new User({ username, password });
// //         await user.save();
// //         res.status(201).json({ message: 'User registered successfully!' });
// //     } catch (error) {
// //         res.status(400).json({ error: 'Registration failed!' });
// //     }
// // });

// // // Login Route
// // app.post('/login', async (req, res) => {
// //     try {
// //         const { username, password } = req.body;
// //         const user = await User.findOne({ username });
// //         if (!user) return res.status(401).json({ error: 'Invalid credentials!' });

// //         const isPasswordValid = await bcrypt.compare(password, user.password);
// //         if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials!' });

// //         const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
// //         res.json({ token });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Login failed!' });
// //     }
// // });
// // app.get('/protected', authenticateToken, (req, res) => {
// //     res.json({ message: 'This is a protected route', user: req.user });
// // });

// // const server = http.createServer(app);
// // const io = new Server(server);

// // app.use(express.static('build'));
// // app.use((req, res, next) => {
// //     // res.sendFile(path.join(__dirname, 'build', 'index.html'));
// //     res.sendFile(path.join(__dirname, 'index.html'));
// // });

// // const userSocketMap = {};
// // function getAllConnectedClients(roomId) {
// //     // Map
// //     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
// //         (socketId) => {
// //             return {
// //                 socketId,
// //                 username: userSocketMap[socketId],
// //             };
// //         }
// //     );
// // }

// // io.on('connection', (socket) => {
// //     console.log('socket connected', socket.id);

// //     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
// //         userSocketMap[socket.id] = username;
// //         socket.join(roomId);
// //         const clients = getAllConnectedClients(roomId);
// //         clients.forEach(({ socketId }) => {
// //             io.to(socketId).emit(ACTIONS.JOINED, {
// //                 clients,
// //                 username,
// //                 socketId: socket.id,
// //             });
// //         });
// //     });

// //     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
// //         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
// //     });

// //     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
// //         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
// //     });

// //     socket.on('disconnecting', () => {
// //         const rooms = [...socket.rooms];
// //         rooms.forEach((roomId) => {
// //             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
// //                 socketId: socket.id,
// //                 username: userSocketMap[socket.id],
// //             });
// //         });
// //         delete userSocketMap[socket.id];
// //         socket.leave();
// //     });
// // });
// // module.exports = {
// //     mongoose
// // };
// // const PORT = process.env.PORT || 5019;
// // server.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// const express = require('express');
// const app = express();
// const http = require('http');
// const path = require('path');
// const { Server } = require('socket.io');
// const ACTIONS = require('./src/Actions');
// require('dotenv').config({ path: './.env' });
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('./src/models/User'); // Import the User model

// const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to MongoDB Atlas');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
// });

// // Middleware to protect routes
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(403).json({ error: 'No token provided or invalid format!' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: 'Invalid or expired token!' });
//         }
//         req.user = user;
//         next();
//     });
// }

// // Register Route
// app.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = new User({ username, password });
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully!' });
//     } catch (error) {
//         res.status(400).json({ error: 'Registration failed!' });
//     }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
//         if (!user) return res.status(401).json({ error: 'Invalid credentials!' });

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials!' });

//         const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ error: 'Login failed!' });
//     }
// });

// app.get('/protected', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static('build'));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// const userSocketMap = {};
// function getAllConnectedClients(roomId) {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

// module.exports = {
//     mongoose
// };

// const PORT = process.env.PORT || 5019;
// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));


const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
const dotenv = require('dotenv');
dotenv.config();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // Handle user joining a room
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // Handle real-time drawing
    socket.on('draw', ({ roomId, x, y }) => {
        socket.to(roomId).emit('draw', { x, y });
    });

    // Sync the drawing to a specific user
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Handle disconnection of a user
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5019;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
