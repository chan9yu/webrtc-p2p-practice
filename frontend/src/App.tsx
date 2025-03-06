import { ChangeEvent, useEffect, useRef, useState } from 'react';

const webSocketURL = 'ws://localhost:8080';

const rtcConfiguration: RTCConfiguration = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		{ urls: 'stun:stun1.l.google.com:19302' },
		{ urls: 'stun:stun2.l.google.com:19302' },
		{ urls: 'stun:stun3.l.google.com:19302' },
		{ urls: 'stun:stun4.l.google.com:19302' }
	]
};

export default function App() {
	const [roomId, setRoomId] = useState('');
	const [websocket, setWebsocket] = useState<WebSocket>();

	const localVideoRef = useRef<HTMLVideoElement | null>(null);
	const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
	const peerConnection = useRef(new RTCPeerConnection(rtcConfiguration)).current;

	const handleChangeRomId = (event: ChangeEvent<HTMLInputElement>) => {
		setRoomId(event.target.value);
	};

	const handleJoomRoom = async () => {
		try {
			if (!roomId) throw new TypeError('Room ID must be a non-empty string.');

			websocket?.send(JSON.stringify({ type: 'join', roomId }));

			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});

			if (localVideoRef.current) {
				localVideoRef.current.srcObject = stream;
			}

			stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);

			websocket?.send(JSON.stringify({ type: 'signal', roomId, signalData: peerConnection.localDescription }));
		} catch (error) {
			alert(error);
		}
	};

	useEffect(() => {
		const ws = new WebSocket(webSocketURL);
		setWebsocket(ws);

		ws.onmessage = async event => {
			const data = JSON.parse(event.data);

			switch (data.type) {
				case 'offer': {
					await peerConnection.setRemoteDescription(data);
					const answer = await peerConnection.createAnswer();
					await peerConnection.setLocalDescription(answer);
					const message = JSON.stringify({ type: 'signal', roomId, signalData: peerConnection.localDescription });
					ws.send(message);
					break;
				}
				case 'answer': {
					await peerConnection.setRemoteDescription(data);
					break;
				}
				case 'candidate': {
					await peerConnection.addIceCandidate(data.candidate);
					break;
				}
				default: {
					console.log(`not vaild data type:\n${JSON.stringify(data, null, 2)}`);
				}
			}
		};

		return () => {
			ws.close();
		};
	}, [peerConnection, roomId]);

	useEffect(() => {
		peerConnection.onicecandidate = event => {
			if (!event.candidate) return;

			const message = JSON.stringify({
				type: 'signal',
				roomId,
				signalData: { type: 'candidate', candidate: event.candidate }
			});
			websocket?.send(message);
		};

		peerConnection.ontrack = event => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = event.streams[0];
			}
		};
	}, [peerConnection, roomId, websocket]);

	return (
		<div>
			<h1>React WebRTC Video Chat</h1>
			<input type="text" placeholder="Enter Room ID" value={roomId} onChange={handleChangeRomId} />
			<button onClick={handleJoomRoom}> Join Room</button>

			<div>
				<div>
					Local Video
					<video ref={localVideoRef} autoPlay width={400} />
				</div>
				<div>
					Remote Video
					<video ref={remoteVideoRef} autoPlay width={400} />
				</div>
			</div>
		</div>
	);
}
