const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateUser = (user) => {
  const requiredFields = ['name', 'email', 'role'];
  return requiredFields.every(field => user[field] !== undefined && user[field] !== '');
};

const getAll = async (req, res) => {
  try {
    const users = await mongodb.getDatabase().db().collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const users = await mongodb.getDatabase().db().collection('users').find({ _id: id }).toArray();
    if (!users.length) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = req.body;
    if (!validateUser(user)) return res.status(400).json({ message: 'Missing required fields: name, email, role' });

    user.createdAt = new Date();
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
    res.status(201).json({ message: 'User created', id: response.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const user = req.body;
    if (!validateUser(user)) return res.status(400).json({ message: 'Missing required fields: name, email, role' });

    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: id }, user);
    if (response.modifiedCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: id });
    if (response.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };