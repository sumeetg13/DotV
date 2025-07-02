const socket = io()
let pc = new RTCPeerConnection()
let localStream

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localStream = stream
  document.getElementById('localVideo').srcObject = stream
  stream.getTracks().forEach(track => pc.addTrack(track, stream))
})

pc.ontrack = e => {
  document.getElementById('remoteVideo').srcObject = e.streams[0]
}

pc.onicecandidate = e => {
  if (e.candidate) socket.emit('ice-candidate', e.candidate)
}

socket.on('user-joined', async () => {
  let offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  socket.emit('offer', offer)
})

socket.on('offer', async offer => {
  await pc.setRemoteDescription(offer)
  let answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  socket.emit('answer', answer)
})

socket.on('answer', answer => pc.setRemoteDescription(answer))
socket.on('ice-candidate', candidate => pc.addIceCandidate(candidate))

function start() {
  const room = prompt("Enter room ID")
  socket.emit('join', room)
}
