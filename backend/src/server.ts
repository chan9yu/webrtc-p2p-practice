import WebSocket from 'ws';

class RoomWebSocket extends WebSocket {
	public roomId?: string;
}

const rooms: Record<string, Set<RoomWebSocket>> = {};
const wss = new WebSocket.Server<typeof RoomWebSocket>({ port: 8080 });

wss.on('connection', (socket: RoomWebSocket) => {
	console.log('A user connected');

	socket.on('message', message => {
		const data = JSON.parse(message.toString());

		switch (data.type) {
			case 'join': {
				rooms[data.roomId] ??= new Set();
				rooms[data.roomId].add(socket);
				socket.roomId = data.roomId;
				console.log(`User joined room: ${data.roomId}`);
				break;
			}
			case 'signal': {
				const { roomId, signalData } = data;
				rooms[roomId].forEach(client => {
					if (client !== socket && client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(signalData));
					}
				});
				break;
			}
			default:
				console.log(`Unknown message type: ${data.type}`);
		}
	});

	socket.on('close', () => {
		if (!socket.roomId) return;

		rooms[socket.roomId].delete(socket);
		console.log(`User disconnected from room ${socket.roomId}`);

		if (rooms[socket.roomId].size === 0) {
			delete rooms[socket.roomId];
			console.log(`Room ${socket.roomId} deleted`);
		}
	});
});

console.log(`WebSocket server is running at ws://localhost:${wss.options.port}`);
