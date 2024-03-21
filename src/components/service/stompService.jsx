import { Client } from '@stomp/stompjs';

const stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws/websocket", // Note: '/websocket' is required when using withSockJS() on the backend
    connectHeaders: {
        login: "user",
        passcode: "password",
    },
    debug: function (str) {
        console.log('STOMP Debug: ', str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

stompClient.onConnect = function (frame) {
  // Do something when connected
    console.log('Connected: ', frame);

  // Subscribe to a topic
    stompClient.subscribe('/topic/userStatus', function (message) {
    // Called when a message is received
    const body = JSON.parse(message.body);
    console.log('Received message:', body);
    });

  // Send a message (e.g., to mark user as online)
  const userId = parseInt("USER_ID_AS_STRING", 10); // Ensure userId is an integer
  stompClient.publish({
    destination: "/app/userOnline",
    body: JSON.stringify({ userId }),
  });
};

stompClient.onStompError = function (frame) {
  // Do something when there's an error
  console.error('Broker reported error: ' + frame.headers['message']);
  console.error('Additional details: ' + frame.body);
};

stompClient.activate();
