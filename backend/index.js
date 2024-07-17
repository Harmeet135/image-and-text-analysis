const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/router');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Hello World! wf');
});

app.use('/', router);

mongoose.set('strictQuery', true);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

if (!CONNECTION_URL) {
    console.log('Missing DATABASE environment variable in the .env file');
    process.exit(1); 
}

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
    process.exit(1); 
  });
