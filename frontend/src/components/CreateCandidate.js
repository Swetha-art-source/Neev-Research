import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const CreateCandidate = () => {
  const [candidateData, setCandidateData] = useState({
    name: '',
    dob: '',
    address: '',
    contactInfo: '',
    gender: '',
  });

  const [generatedBarcode, setGeneratedBarcode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateData({
      ...candidateData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the candidate data to your API
      const response = await axios.post('http://localhost:5000/candidates', candidateData);
      console.log('Response Data:', response.data);
      
      // Assuming your API responds with the generated barcode data
      if (response.data && response.data.barcode) {
        const barcodeData = response.data.barcode;
        setGeneratedBarcode(barcodeData);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name='name'
          placeholder="Name"
          value={candidateData.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name='dob'
          placeholder="DOB"
          value={candidateData.dob}
          onChange={handleChange}
        />
        <input type="text" name='address' placeholder='address' value={candidateData.address} onChange={handleChange} />
        <input type="number" name='contactInfo' placeholder='contactInfo' value={candidateData.contactInfo} onChange={handleChange} />
        <input type='text' name='gender' placeholder='Gender' value={candidateData.gender} onChange={handleChange} />
        <button type="submit">Create Candidate</button>
      </form>

      {generatedBarcode && (
        <div>
          <h2>Generated Barcode:</h2>
          <QRCode value={generatedBarcode} size="300" bgColor='#ffffff' fgColor='#000000' />
        </div>
      )}
    </div>
  );
};

export default CreateCandidate;
