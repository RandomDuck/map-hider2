import React, { useState, useEffect } from "react";

function App() {
  const [client, setClient] = useState();
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the WebSocket server
    const client = new WebSocket("ws://localhost:4000")
    client.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      client.send("Hello from React");
    };

    client.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessage(event.data); // Update state with the server's message
    };

    client.onerror = (error) => console.error("WebSocket error:", error);
    client.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    setClient(client);
    // Cleanup WebSocket on component unmount
    return () => client.close();
  }, []);

  return (
    <div>
      <h1>WebSocket with Express</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <p>Message from server: {message}</p>
      <button onClick={() => {
        client.send("Test message from React");
      }}>
        Send Test Message
      </button>
    </div>
  );
}

export default App;
