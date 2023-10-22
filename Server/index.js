// import the express module
const express = require('express')

// import the mongoose module
const mongoose = require('mongoose')

// define an express app
const app = express()
app.use(express.json())

// import the cors module
const cors = require("cors")
app.use(cors())

// connect VS Code to database
mongoose.connect("mongodb://127.0.0.1:27017/PFA")



/* import the models */

// import Student model
const StudentModel = require("./models/Student")

// import Formateur model
const FormateurModel = require("./models/Formateur")

// import Formation model
const FormationModel = require("./models/Formation")

// import InscriptionFormation model
const InscriptionFormationModel = require("./models/InscriptionFormation")

// import Workshop model
const WorkshopModel = require("./models/Workshop")

// import InscriptionWorkshop model
const InscriptionWorkshopModel = require("./models/InscriptionWorkshop")

// import Feedback model
const FeedbackModel = require("./models/Feedback")

// import Feedback Workshop Model
const FeedbackWorkshopModel = require("./models/FeedbackWorkshop")

// import Session Model
const SessionModel = require("./models/Session")

/* import the models */



/* define the endpoints */

// display students
app.get('/students', async (req, res) => {
    const students = await StudentModel.find()
    res.json(students)
})

// display formateurs
app.get("/formateurs", async (req, res) => {
  const formateurs = await FormateurModel.find()
  res.json(formateurs)
})

// display formations
app.get("/formations", async (req, res) => {
  const formations = await FormationModel.find()
  res.json(formations)
})

// display workshops
app.get("/workshops", async (req, res) => {
  const workshops = await WorkshopModel.find()
  res.json(workshops)

})



// display sessions
app.get('/sessions', async(req, res) => {
  const sessions = await SessionModel.find()
  res.json(sessions)
})

// show formations inscriptions details
app.get('/inscriptionformations', async (req, res) => {
    const inscriptionformations = await InscriptionFormationModel.find()
    res.json(inscriptionformations)
})

// submit a formation inscription
app.post("/submitAnInscriptionFormation", async (req, res) => {
    try {
        const inscription = req.body
        const { formationName, formationId, studentCode } = inscription
    
        // Check if a document with the same student code and formationName already exists
        const existingInscription = await InscriptionFormationModel.findOne({ studentCode, formationName, formationId })
    
        // generates a 400 error status code in that case
        if (existingInscription) {
          res.status(400).json({ error: 'Inscription already exists' })
        } else {

          // Check if formationId is provided exists
          if (!formationId) {
            return res.status(400).json({ message: 'Formation ID is required' });
          }

          // Parse formationId as ObjectId
          const formationIdObj = new mongoose.Types.ObjectId(formationId);

          // Update inscriptions count for the formation in the formations collection in database
          await FormationModel.findOneAndUpdate(
            { _id: formationIdObj },
            { $inc: { inscriptionsCount: 1 } }
          );

          // save the inscription to the collection
          const newInscription = new InscriptionFormationModel(inscription)
          await newInscription.save()
    
          res.json(inscription)
        }
      } catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
      }
})

// show workshops inscriptions details
app.get('/inscriptionworkshops', async (req, res) => {
    const inscriptionworkshops = await InscriptionWorkshopModel.find()
    res.json(inscriptionworkshops)
})

// submit a workshop inscription
app.post("/submitAnInscriptionWorkshop", async (req, res) => {
    try {
        const inscription = req.body
        const { studentCode, workshopName, workshopId } = inscription
    
        // Check if a document with the same student code already exists
        const existingInscription = await InscriptionWorkshopModel.findOne({ studentCode, workshopName, workshopId })
    
        // generates a 400 error status code in that case
        if (existingInscription) {
          res.status(400).json({ error: 'Inscription already exists' })
        } else {


          // Check if workshopId is provided
          if (!workshopId) {
            return res.status(400).json({ message: 'Formation ID is required' });
          }

          // Parse workshopId as ObjectId
          const workshopIdObj = new mongoose.Types.ObjectId(workshopId);

          // Update inscriptions count for the formation in the database
          await WorkshopModel.findOneAndUpdate(
            { _id: workshopIdObj },
            { $inc: { inscriptionsCount: 1 } }
          );

          // save the inscription to the collection
          const newInscription = new InscriptionWorkshopModel(inscription)
          await newInscription.save()
    
          res.json(inscription)

        }
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
      }
})

// display feedbacks
app.get("/feedbacks", async (req, res) => {
    const feedbacks = await FeedbackModel.find()
    res.json(feedbacks)
})

// display workshops feedbacks
app.get("/feedbacksWorkshops", async (req, res) => {
  const feedbacksWorkshops = await FeedbackWorkshopModel.find()
  res.json(feedbacksWorkshops)
})

// submit a formation feedback
app.post("/submitAFeedback", async (req, res) => {

    const feedback = req.body;
    const newFeedback = new FeedbackModel(feedback);
    
    const { studentCode, studentEmail } = feedback;
    const existingFeedback = await FeedbackModel.findOne({ studentCode, studentEmail });

    // prevent the same student from submitting more than 1 feedback at a day
    if (existingFeedback) {
      const now = new Date();

      const lastSubmitted = new Date(existingFeedback.createdAt);

      const timeDiff = now.getTime() - lastSubmitted.getTime();

      const daysDiff = timeDiff / (1000 * 3600 * 24);
  
      if (daysDiff < 1) {
        res.status(400).json({ message: "You must wait 24 hours before submitting another feedback" });
        return;
      }else {
        await newFeedback.save();
        res.json(feedback);
      }
    } else {
      await newFeedback.save();
      res.json(feedback);
    }
})

// submit a workshop feedback
app.post("/submitAWorkshopFeedback", async (req, res) => {

    const feedbackWorkshopRequest = req.body;
    const newFeedback = new FeedbackWorkshopModel(feedbackWorkshopRequest);

    const { studentCode, studentEmail } = feedbackWorkshopRequest;
    const existingFeedback = await FeedbackWorkshopModel.findOne({ studentCode, studentEmail });

    // prevent the same student from submitting more than 1 feedback at a day
    if (existingFeedback) {
      const now = new Date();

      const lastSubmitted = new Date(existingFeedback.createdAt);

      const timeDiff = now.getTime() - lastSubmitted.getTime();

      const daysDiff = timeDiff / (1000 * 3600 * 24);
  
      if (daysDiff < 1) {
        res.status(404).json({ message: "You must wait 24 hours before submitting another feedback" });
        return;
      } else {
        await newFeedback.save();
        res.json(feedbackWorkshopRequest);
      }
    } else {
      await newFeedback.save();
      res.json(feedbackWorkshopRequest);
    }
})

/* define the endpoints */



/* go to each formation page dynamically */

app.get('/formations/:id', (req, res) => {
  const id = req.params.id;
  FormationModel.findById(id)
    .then((formation) => {
      res.json(formation);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/* go to each formation page dynamically */



/* go to each workshop page dynamically */

app.get('/workshops/:id', (req, res) => {
  const id = req.params.id;
  WorkshopModel.findById(id)
    .then((workshop) => {
      res.json(workshop);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/* go to each workshop page dynamically */



// get the feedbacks based on the studentEmail
app.get("/feedbacks/:studentEmail", async (req, res) => {
  const studentEmail = req.params.studentEmail;

  const feedbacks = await FeedbackModel.find({ studentEmail });

  res.json(feedbacks);
})

// number of visitors
let numVisitors = 0;
app.get('/visitors', (req, res) => {
    numVisitors++;
    res.json({ count: numVisitors });
});

/* organisation page */

// filter the formations based on their dates
app.get("/formationsFiltredByDate", async (req, res) => {
    const { startDate } = req.query;
    await  FormationModel.find({ startDateFormation : startDate })
      .then(formations => {
        res.json(formations);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server Error');
      });
})

// filter the workshops based on their dates
app.get("/workshopsFiltredByDate", async (req, res) => {
  const { startDate } = req.query;
  await  WorkshopModel.find({ workshopDate : startDate })
    .then(workshops => {
      res.json(workshops);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server Error');
    });
})

/* organisation page */
// Route to get the list of students enrolled for each formationName and formationId
app.get('/getEnrolledStudentsPerFormation', async (req, res) => {
  try {
    // Query the MongoDB collection to retrieve all documents
    const inscriptionFormations = await InscriptionFormationModel.find();

    // Group the documents by formationName and formationId
    const groupedInscriptions = inscriptionFormations.reduce((acc, inscription) => {
      const key =`${inscription.formationName}-${inscription.formationId}` ;
      if (!acc[key]) {
        acc[key] = {
          formationName: inscription.formationName,
          formationId: inscription.formationId,
          students: []
        };
      }
      acc[key].students.push({
        studentFirstName: inscription.studentFirstName,
        studentLastName: inscription.studentLastName,
        studentEmail: inscription.studentEmail,
        studentSection: inscription.studentSection,
        studentCode: inscription.studentCode
      });
      return acc;
    }, {});

    // Convert the groupedInscriptions object to an array of values
    const groupedInscriptionsArray = Object.values(groupedInscriptions);

    res.status(200).json(groupedInscriptionsArray);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to get the list of students enrolled for each formationName and formationId
app.get('/getEnrolledStudentsPerWorkshop', async (req, res) => {
  try {
    // Query the MongoDB collection to retrieve all documents
    const inscriptionWorkshops = await InscriptionWorkshopModel.find();

    // Group the documents by formationName and formationId
    const groupedInscriptions = inscriptionWorkshops.reduce((acc, inscription) => {
      const key =`${inscription.workshopName}-${inscription.workshopId}` ;
      if (!acc[key]) {
        acc[key] = {
          workshopName: inscription.workshopName,
          workshopId: inscription.workshopId,
          students: []
        };
      }
      acc[key].students.push({
        studentFirstName: inscription.studentFirstName,
        studentLastName: inscription.studentLastName,
        studentEmail: inscription.studentEmail,
        studentSection: inscription.studentSection,
        studentCode: inscription.studentCode
      });
      return acc;
    }, {});

    // Convert the groupedInscriptions object to an array of values
    const groupedInscriptionsArray = Object.values(groupedInscriptions);

    res.status(200).json(groupedInscriptionsArray);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



// define the port that the express server is running on and display a descriptive message
app.listen(5000, () => {console.log("app is running on port 5000")})