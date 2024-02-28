const express = require("express");
const router = express.Router();
const Prize = require("../models/prize");

// Function to randomize probabilities
function randomizeProbabilities(probabilities) {
  const randomizedData = [];
  probabilities.forEach((probability) => {
      const randomValue = parseFloat(probability) + (Math.random() * 0.4 - 0.2);
      randomizedData.push({ title: "Title", probability: randomValue.toFixed(2) });
  });
  return randomizedData;
}

// GET route for retrieving all prizes
router.get("/", async (req, res) => {
  try {
      const prizes = await Prize.find();
      let totalProbability = 0;
      prizes.forEach(prize => {
          totalProbability += parseFloat(prize.probability);
      });
      
      // Generate original probabilities
      const originalProbabilities = prizes.map(prize => prize.probability);

      // Generate randomized probabilities
      const randomizedProbabilities = randomizeProbabilities(originalProbabilities);

      res.render("home", { prizes, totalProbability, randomizedProbabilities });
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});

// GET route for rendering the create form
router.get("/create",async (req, res) => {
  try {
    const prizes = await Prize.find();
    let totalProbability = 0;
    prizes.forEach(prize => {
        totalProbability += prize.probability;
    });
    res.render("create", { prizes, totalProbability });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal2 Server Error");
  }
});

// POST route for adding a new club
router.post("/add", async (req, res) => {
  const { prize_id, title, probability, numPrizes } = req.body;

  try {
    const newPrize = new Prize({ prize_id, title, probability });
    const existingPrize = await Prize.findOne({ prize_id: prize_id });
    if (existingPrize) {
      console.error("Prize ID already exists");
      return res.status(400).send("Prize ID already exists");
    }
    await newPrize.save();
    console.log("Prize added successfully");
    res.redirect("/");
  } catch (err) {
    console.log("Error adding prize:", err);
    res.status(500).send("Internal3 Server Error");
  }
});

router.get("/edit/:prize_id", async (req, res) => {
  try {
    const prizeId = req.params.prize_id;
    console.log("Requested Prize ID:", prizeId);

    const prize = await Prize.findOne({ prize_id: prizeId });
    console.log("Found Prize:", prize);

    const prizes = await Prize.find(); // Fetch all prizes
    let totalProbability = 0;
    prizes.forEach(prize => {
        totalProbability += prize.probability;
    });
    if (!prize) {
      console.error("Prize not found");
      return res.status(404).send("Prize not found");
    }
    res.render("edit", { prize, prizes }); // Pass both prize and prizes to the template
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});



router.post("/update/:prize_id", async (req, res) => {
  try {
    const { title, probability } = req.body;
    const updatedPrize = await Prize.findOneAndUpdate({ prize_id: req.params.prize_id }, {
      title,
      probability,
    });
    if (!updatedPrize) {
      return res.status(404).send("Prize not found");
    }
    console.log("Prize updated Successfully")
    res.redirect("/")
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

// GET route for deleting a specific club
router.get("/delete/:id", async (req, res) => {
  const prizeId = req.params.id;

  try {
    await Prize.findByIdAndDelete(prizeId);
    console.log("Prize deleted successfully");
    res.redirect("/");
  } catch (err) {
    console.log("Error deleting prize:", err);
    res.status(500).send("Internal5 Server Error");
  }
});



module.exports = router;
