if (window.location.pathname.startsWith("/room/")) {
  const socket = io()
  const roomId = window.location.pathname.split("/").pop()
  document.getElementById('roomHeader').innerText = `Room: ${roomId}`

  let pc = new RTCPeerConnection()
  let localStream

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream
    document.getElementById('localVideo').srcObject = stream
    stream.getTracks().forEach(track => pc.addTrack(track, stream))
  })

  pc.ontrack = e => {
    if (e.streams.length > 0) {
      document.getElementById('remoteVideo').srcObject = e.streams[0]
    }
  }

  pc.onicecandidate = e => {
    if (e.candidate) socket.emit('ice-candidate', e.candidate)
  }

  socket.emit('join', roomId)

  socket.on('user-joined', async () => {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket.emit('offer', offer)
  })

  socket.on('offer', async offer => {
    await pc.setRemoteDescription(offer)
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    socket.emit('answer', answer)
  })

  socket.on('answer', answer => pc.setRemoteDescription(answer))
  socket.on('ice-candidate', candidate => pc.addIceCandidate(candidate))
}
