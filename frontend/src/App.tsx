// App.js
import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const numberOfSperms = 80;
  const sperms = [];

  for (let i = 0; i < numberOfSperms; i++) {
    const style = {
      left: `${Math.random() * (window.innerWidth - 43)}px`,
      top: `${Math.random() * (window.innerHeight - 205.42)}px`,
      transform: `rotate(${Math.random() * 360}deg)`
    };
    sperms.push(<div className="sperm" style={style} key={i}></div>);
  }

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('File uploaded successfully:', response.data);
        // Handle success
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle error
      });
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="options">
          <h2>3tina chi fichier lyj3l rbi y7en 3lik</h2>
          <label htmlFor="file-upload" className="custom-file-upload">
            <input id="file-upload" type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} />
          </label>
          <button onClick={handleUpload}>Tle3</button>
        </div>
      </div>
      <div className="sperms-container">
        <div className='sperms'>
          {sperms}
        </div>
      </div>
    </div>
  );
}

export default App;
