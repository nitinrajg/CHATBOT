import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;

      setTranscript(transcript);
    };

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);

      if (transcript) {
        axios.post('/process-voice', { transcript })
          .then((response) => {
            setResponse(response.data.text);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [transcript]);

  return (
    <div>
      <h1>Voice Chatbot</h1>
      <p>Listening: {listening ? 'Yes' : 'No'}</p>
      <p>Transcript: {transcript}</p>
      <p>Response: {response}</p>
    </div>
  );
}

export default App;