const express = require("express");
const Task = require("../models/task");
const router = new express.Router();

// Create a new Task
router.post("/task", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read Tasks
router.get("/task", async (req, res) => {
  try {
    const task = await Task.find({});
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Read Task by ID
router.get("/task/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.staus(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Task by ID
router.patch("/task/:id", async (req, res) => {
  const _id = req.params.id;
  const change = req.body;

  const allowedUpdates = ["description", "completed"];
  const update = Object.keys(change);
  const isValidOperation = update.every(key => {
    return allowedUpdates.includes(key);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Upadte name is invalid" });
  }

  try {
    const task = await Task.findByIdAndUpdate(_id, change, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Delete Task By ID
router.delete("/task/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.staus(500).send();
  }
});

module.exports = router;
