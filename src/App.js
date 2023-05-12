import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outlinedImage, setOutlinedImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    var file = event.target.files[0];
    console.log(file);

    handleImageUploadSelectedImage = URL.createObjectURL(event.target.files[0]);

    setSelectedImage(handleImageUploadSelectedImage);
    setOutlinedImage(null);
  };

  // This useEffect hook will run every time selectedImage changes.
  useEffect(() => {
    console.log(selectedImage);

    fetch(selectedImage)
    .then(response => response.blob())
    .then(blob => {
      var reader = new FileReader();
      reader.onloadend = function() {
        var base64data = reader.result;
        console.log(base64data);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "image/jpeg");

        console.log(selectedImage);
        console.log(typeof selectedImage);
        var file = base64data;

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: file,
          redirect: 'follow'
        };

      fetch("http://35.91.42.35:8080/yolo", requestOptions)
        .then(response => response.blob())
        .then(blob => {
          // Create an object URL for the blob
          const blobUrl = URL.createObjectURL(blob);

          // Use this URL to display the image
          setOutlinedImage(blobUrl);
        })
        .catch(error => console.log('error', error));
      }
      reader.readAsArrayBuffer(blob);
    });
  }, [selectedImage]);

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
