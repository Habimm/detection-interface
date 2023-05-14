import './App.css';
import React, { useState } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outlinedImage, setOutlinedImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files.length === 0) {
      return;
    }

    var selectedFileObject = event.target.files[0];

    // We use a temporary variable, because
    // React batches state updates for performance reasons,
    // so we cannot call setSelectedImage() and expect
    // selectedImage to hold the correct value in the next line.
    var tempSelectedImage = URL.createObjectURL(selectedFileObject);

    fetch(tempSelectedImage)
      .then(response => response.blob())
      .then(blob => {
        var reader = new FileReader();
        reader.onloadend = function() {
          // could be a: ArrayBuffer(497559)
          var imageArrayBuffer = reader.result;

          var myHeaders = {
            "Content-Type": "image/jpeg"
          };

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: imageArrayBuffer,
            redirect: 'follow',
          };

        fetch(process.env.REACT_APP_API_URL, requestOptions)
          .then(response => response.blob())
          .then(blob => {
            const detectionsBlobUrl = URL.createObjectURL(blob);
            setOutlinedImage(detectionsBlobUrl);
          })
          .catch(error => console.log('error', error));
        }
        reader.readAsArrayBuffer(blob);
      });

    setSelectedImage(tempSelectedImage);
  };

  return (
    <div className="App">
    <h3>
      Upload an image to detect objects!
    </h3>
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
