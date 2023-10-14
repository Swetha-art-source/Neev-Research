import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const webcamRef = React.useRef(null);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: webcamRef.current,
        },
        decoder: {
          readers: ['qrcode'],
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.onDetected((data) => {
          setScannedData(data.codeResult.code);
        });
        Quagga.start();
      }
    );

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment' }}
      />
      <p>Scanned Data: {scannedData}</p>
    </div>
  );
};

export default BarcodeScanner;
