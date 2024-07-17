const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Task = require('../models/userSchema');
const path = require('path');


const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null,'./uploads/');
  },
  filename: function(req,file,cb){
      cb(null, file.originalname);
  }
});

const upload = multer({storage})

router.post('/uploadimg', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const language = req.body.language;
    
    Tesseract.recognize(filePath, language, {
      logger: m => console.log(m)
    })
    .then(({ data: { text } }) => {
      const newTask = new Task({
        image: filePath,
        extractedText: text,
      });

      newTask.save()
      .then(savedTask => {
        res.status(201).json(savedTask);
      })
      .catch(err => {
        console.error('Error saving the task:', err);
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/gettasks', (req, res) => {
  Task.find({})
    .then(tasks => {
      res.status(200).json(tasks);
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    });
});


module.exports = router;
