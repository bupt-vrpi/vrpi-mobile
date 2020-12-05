import React, { useEffect, useState, useCallback } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from "react-native-webrtc";
import io from "socket.io-client";

const pc_config = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302",
    },
  ],
};

export default function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [socket] = useState(
    io.connect("https://e3584446f823.ngrok.io/webrtcPeer", {
      path: "/io/webrtc",
      query: {},
    })
  );

  const [pc] = useState(new RTCPeerConnection(pc_config));

  const sendToPeer = useCallback((messageType, payload) => {
    socket.emit(messageType, {
      socketID: socket.id,
      payload,
    });
  }, []);

  /* ACTION METHODS FROM THE BUTTONS ON SCREEN */

  const createOffer = () => {
    console.log("Offer");

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    // initiates the creation of SDP
    pc.createOffer({ offerToReceiveVideo: true }).then((sdp) => {
      // console.log(JSON.stringify(sdp))

      // set offer sdp as local description
      pc.setLocalDescription(sdp);

      sendToPeer("offerOrAnswer", sdp);
    });
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
  // creates an SDP answer to an offer received from remote peer
  const createAnswer = () => {
    console.log("Answer");
    pc.createAnswer().then((sdp) => {
      // console.log(JSON.stringify(sdp))

      // set answer sdp as local description
      pc.setLocalDescription(sdp);

      sendToPeer("offerOrAnswer", sdp);
    });
  };

  useEffect(() => {
    socket.on("connection-success", (success: any) => {
      console.log(success);
    });

    socket.on("offerOrAnswer", (sdp: any) => {
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("candidate", (candidate: any) => {
      // console.log('From Peer... ', JSON.stringify(candidate))
      // this.candidates = [...this.candidates, candidate]
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // triggered when a new candidate is returned
    pc.onicecandidate = (e) => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer
      if (e.candidate) {
        // console.log(JSON.stringify(e.candidate))
        sendToPeer("candidate", e.candidate);
      }
    };

    // triggered when there is a change in connection state
    pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    // triggered when a stream is added to pc, see below - pc.addStream(stream)
    pc.onaddstream = ({ stream }) => {
      setRemoteStream(stream);
    };

    // called when getUserMedia() successfully returns - see below
    // getUserMedia() returns a MediaStream object (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
    const success = (stream: MediaStream | boolean) => {
      if (stream !== true && stream !== false) {
        setLocalStream(stream);
        pc.addStream(stream);
      }
    };

    // called when getUserMedia() fails - see below
    const failure = (e: any) => {
      console.log("getUserMedia Error: ", e);
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    // see the above link for more constraint options
    const constraints = {
      audio: false,
      video: true,
      // video: {
      //   width: 1280,
      //   height: 720
      // },
      // video: {
      //   width: { min: 1280 },
      // }
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    mediaDevices.getUserMedia(constraints).then(success).catch(failure);
  }, [sendToPeer]);

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <RTCView
        style={{ flex: 1 }}
        key={1}
        streamURL={localStream?.toURL() ?? ""}
      />
      <RTCView
        style={{ flex: 1 }}
        key={2}
        streamURL={remoteStream?.toURL() ?? ""}
      />

      <TouchableOpacity onPress={createOffer}>
        <View>
          <Text>Offer</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={createAnswer}>
        <View>
          <Text>Answer</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
