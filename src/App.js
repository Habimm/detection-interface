import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outlinedImage, setOutlinedImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files.length === 0) {
      return;
    }

    var fileInformationJSONObject = event.target.files[0];
    console.log(fileInformationJSONObject);

    var handleImageUploadSelectedImage = URL.createObjectURL(fileInformationJSONObject);

    fetch(handleImageUploadSelectedImage)
    .then(response => response.blob())
    .then(blob => {
      var reader = new FileReader();
      reader.onloadend = function() {
        var base64data = reader.result;
        console.log(base64data);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "image/jpeg");

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: base64data,
          redirect: 'follow'
        };

      fetch("http://35.91.42.35:8080/yolo", requestOptions)
        .then(response => response.blob())
        .then(blob => {
          const detectionsBlobUrl = URL.createObjectURL(blob);
          setOutlinedImage(detectionsBlobUrl);
        })
        .catch(error => console.log('error', error));
      }
      reader.readAsArrayBuffer(blob);
    });

    setSelectedImage(handleImageUploadSelectedImage);
  };

  return (
    <div className="App">
      <header className="App-header">
        <input
          style={{border: '4px solid red'}}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {(
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <img
              src={selectedImage}
              alt="Selected"
              style={{width: '100%', height: 'auto', border: '10px solid yellow', maxWidth: '45%'}}
            />
            <img
              src={outlinedImage}
              alt="Outlined"
              style={{width: '100%', height: 'auto', border: '10px solid yellow', maxWidth: '45%'}}
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
