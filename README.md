# DotV



```
webrtc-video-call/
├── server.js
├── package.json
├── public/
│   ├── index.html
│   └── script.js
```


## Basic Limitations of simple WEBRTC - it supports peer-to-peer connections 

## To support multipeer connections : 
To support >2 users in a room:

1. Maintain a Map of peerId => RTCPeerConnection per client

2. When a new user joins, they:

    [*] create a connection to each existing user

    [*] each existing user creates a connection back to them

3. Each RTCPeerConnection handles its own signaling and ICE exchange

