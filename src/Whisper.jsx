import React, { useState } from 'react';



const API_KEY = "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";

const Whisper = () => {
  const [file, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');

  const handleAudioFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleTranscribeClick = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: {API_KEY},
      },
      body: formData,
    });

    const data = await response.json();
    setTranscription(data.text);
  };


  return (
    <div className="App">
      <input type="file" accept="audio/*" onChange={handleAudioFileChange} />
      <button  onClick={handleTranscribeClick}>
        Transcribe
      </button>
      <div>{transcription}</div>
    </div>
  )
}

export default Whisper