const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateTask = (task) => {
  const requiredFields = ['title', 'description', 'status', 'priority', 'projectId', 'assignedTo'];
  return requiredFields.every(field => task[field] !== undefined && task[field] !== '');
};

const getAll = async (req, res) => {
  try {
    const tasks = await mongodb.getDatabase().db().collection('tasks').find().toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const tasks = await mongodb.getDatabase().db().collection('tasks').find({ _id: id }).toArray();
    if (!tasks.length) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(tasks[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = req.body;
    if (!validateTask(task)) return res.status(400).json({ message: 'Missing required fields: title, description, status, priority, projectId, assignedTo' });

    task.createdAt = new Date();
    const response = await mongodb.getDatabase().db().collection('tasks').insertOne(task);
    res.status(201).json({ message: 'Task created', id: response.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const task = req.body;
    if (!validateTask(task)) return res.status(400).json({ message: 'Missing required fields: title, description, status, priority, projectId, assignedTo' });

    const response = await mongodb.getDatabase().db().collection('tasks').replaceOne({ _id: id }, task);
    if (response.modifiedCount === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('tasks').deleteOne({ _id: id });
    if (response.deletedCount === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createTask, updateTask, deleteTask };