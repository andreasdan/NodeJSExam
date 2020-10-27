module.exports = {
    run: (io) => {
        io.on('connection', socket => {
            // join room upon request (room is thread id)
            socket.on('join', room => {
                socket.join(room);
            });

            //broadcast to all except sender
            socket.on('push', room => {
                socket.to(room).emit('push', 'fetch');
            });
        });
    }
}