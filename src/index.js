const express = require("express");
require("./db/mongoose");

const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find({});

    res.send(user);
  } catch {
    res.status(500).send();
  }
});

app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch {
    res.status(500).send();
  }
});

app.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const update = req.body;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(key => {
    return allowedUpdates.includes(key);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, update, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.staus(400).send();
  }
});

app.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.post("/task", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/task", async (req, res) => {
  try {
    const task = await Task.find({});
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/task/:id", async (req, res) => {
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

app.patch("/task/:id", async (req, res) => {
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

app.delete("/task/:id", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
