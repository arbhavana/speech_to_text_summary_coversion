import React, { useState } from "react";
import "./App.css";


function App() {
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudio(file);
    if (file) {
      setAudioUrl(URL.createObjectURL(file));
    }
    setTranscript("");
    setSummary("");
  };

  const handleUpload = async () => {
    if (!audio) return alert("Please select an audio file!");

    const formData = new FormData();
    formData.append("audio", audio);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscript(data.transcript || "No transcript available.");
      setSummary(data.summary || "No summary available.");
    } catch (error) {
      alert("Error uploading file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🎧 Audio Transcription & Summarization</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Transcribe"}
      </button>

      {audioUrl && (
        <div className="section">
          <h2>🔊 Audio Playback</h2>
          <audio controls src={audioUrl} />
        </div>
      )}

      {transcript && (
        <div className="section">
          <h2>📝 Transcript</h2>
          <textarea readOnly value={transcript}></textarea>
        </div>
      )}

      {summary && (
        <div className="section">
          <h2>📄 Summary</h2>
          <textarea readOnly value={summary}></textarea>
        </div>
      )}
    </div>
  );
}

export default App;
