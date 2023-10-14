const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const bwipjs = require('bwip-js');




const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

const URI = process.env.MongoURI

// MongoDB Connection
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const candidateSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  address: String,
  contactInfo: Number,
  gender: String,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a new candidate
app.post('/candidates', async (req, res) => {
  const { name, dob, address, contactInfo, gender } = req.body;

  try {
    const dobDate = new Date(dob);
    const newCandidate = new Candidate({
      name,
      dob: dobDate,
      address,
      contactInfo,
      gender,
    });

    const barcodeValue = generateUniqueBarcode();

    // Save the candidate data to a text file
    const candidateData = JSON.stringify(newCandidate);
    const fileName = `candidate_${newCandidate._id}.json`;
    fs.writeFileSync(`./candidate_data/${fileName}`, candidateData);

    await newCandidate.save();
    console.log(newCandidate);
    res.status(201).json({ candidate: newCandidate, barcode: barcodeValue, message: 'Candidate created successfully' });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Could not create candidate' });
  }
});

function generateUniqueBarcode() {
  const barcodeValue = Math.floor(Math.random() * 1000000000).toString();
  return barcodeValue;
}

// Retrieve all candidates
app.get('/candidates/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;

    // Find the candidate to get their data file name
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Retrieve the candidate's data file
    const fileName = `candidate_${candidate._id}.json`;
    const filePath = `./candidate_data/${fileName}`;

    // Read the data from the file
    const data = fs.readFileSync(filePath, 'utf-8');
    const candidateData = JSON.parse(data);

    res.json(candidateData);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch candidate data' });
  }
});

// Retrieve all candidates
app.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch candidates' });
  }
});

// Update candidate data
app.put('/candidates/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;

    // Find the candidate to update
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Retrieve the candidate's data file
    const fileName = `candidate_${candidate._id}.json`;
    const filePath = `./candidate_data/${fileName}`;

    // Read the existing data from the file
    const data = fs.readFileSync(filePath, 'utf-8');
    let candidateData = JSON.parse(data);

    // Update the candidate data with the new data
    candidateData = { ...candidateData, ...req.body };

    // Save the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(candidateData));

    res.json(candidateData);
  } catch (error) {
    res.status(500).json({ error: 'Could not update candidate data' });
  }
});


// Delete candidate
app.delete('/candidates/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    
    // Find the candidate to be deleted to get their data file name
    const candidate = await Candidate.findById(candidateId);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Delete the candidate data file
    const fileName = `candidate_${candidate._id}.json`;
    const filePath = `./candidate_data/${fileName}`;
    
    fs.unlinkSync(filePath); // Delete the file

    // Remove the candidate from the database
    await Candidate.findByIdAndRemove(candidateId);

    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete candidate' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
