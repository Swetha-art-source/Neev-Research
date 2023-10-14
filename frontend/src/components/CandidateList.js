import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/candidates')
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error('GET request error:', error);
      });
  }, []);

  const handleCandidateClick = (candidate) => {
    // Fetch the individual candidate details by ID
    axios.get(`http://localhost:5000/candidates/${candidate._id}`)
      .then(response => {
        setSelectedCandidate(response.data);
      })
      .catch(error => {
        console.error('GET request error:', error);
      });
  };

  return (
    <div>
      <h2>Candidate List</h2>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate._id} onClick={() => handleCandidateClick(candidate)}>
            Name: {candidate.name}, DOB: {candidate.dob}, Address: {candidate.address}, Gender: {candidate.gender}
          </li>
        ))}
      </ul>

      {selectedCandidate && (
        <div>
          <h3>Selected Candidate</h3>
          <p>Name: {selectedCandidate.name}</p>
          <p>DOB: {selectedCandidate.dob}</p>
          <p>Address: {selectedCandidate.address}</p>
          <p>Gender: {selectedCandidate.gender}</p>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
