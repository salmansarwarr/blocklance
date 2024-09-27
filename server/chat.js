import { Server } from 'socket.io';

// state 
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray;
    }
};

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    };
}

function activateUser(id, name, room) {
    const user = { id, name, room };
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ]);
    return user;
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    );
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id);
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room);
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)));
}

export default function setupSocket(server) {
    console.log("Server setup complete");
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5500', 'http://127.0.0.1:5500']
        }
    });

    io.on('connection', socket => {
        console.log(`User ${socket.id} connected`);

        // Upon connection - only to user 
        socket.emit('message', buildMsg('Admin', 'Welcome to Chat App!'));

        // Emit message from server to client after 3 seconds
        setTimeout(() => {
            socket.emit('message', buildMsg('Server', 'Hello from the server after 3 seconds!'));
        }, 3000);

        // Your Socket.IO event listeners and logic here...

        socket.on('disconnect', () => {
            const user = getUser(socket.id);
            userLeavesApp(socket.id);

            if (user) {
                io.to(user.room).emit('message', buildMsg('Admin', `${user.name} has left the room`));
                io.to(user.room).emit('userList', {
                    users: getUsersInRoom(user.room)
                });
                io.emit('roomList', {
                    rooms: getAllActiveRooms()
                });
            }

            console.log(`User ${socket.id} disconnected`);
        });
    });
}
