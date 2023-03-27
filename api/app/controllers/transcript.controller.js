const authConfig = require("../config/auth.config.js");
const db = require("../models");
const Transcript = db.transcripts;
const Op = db.Sequelize.Op;
const crypto = require('crypto');

// Create and Save a new Transcript
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
    return;
  }
  
  else if (!req.body.originalContent) {
    res.status(400).send({
      message: "Original Content cannot be empty!"
    });
    return;
  }

  // add authentication token to prevent dos attacks
  else if (!req.body.authToken) {
    res.status(400).send({
      message: "Auth token cannot be empty!"
    });
    return;
  }


  const verifyToken = (token) => {

    return token === authConfig.TOKEN;
  }

  const generateHash = () => {

    const oc = req.body.originalContent
    const hashParams = oc.title + oc.media + oc.date
    const transcriptHash = crypto.createHash('sha256').update(hashParams).digest('base64');

    return transcriptHash;
  }


  if (!verifyToken(req.body.authToken)) {
    res.status(400).send({
      message: "Auth token is invalid"
    });
    return;
  }
  // Create a Transcript
  const transcript = {
    originalContent: req.body.originalContent,
    content:req.body.originalContent,
    transcriptHash: generateHash()
  };

  // Save Transcript in the database
  Transcript.create(transcript)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Transcript."
      });
    });
};

// Retrieve all Transcripts from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Transcript.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transcript."
      });
    });
};

// Find a single Transcript with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Transcript.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Transcript with id=" + id
      });
    });
};

// Update a Transcript by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Transcript.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Transcript was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Transcript with id=${id}. Maybe Transcript was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Transcript with id=" + id
      });
    });
};

//FIXME: Add an archive route in order to cater for archived transcripts and filling the archivedAt field in the model. 
