const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

const validateUser = (user) => {
  const requiredFields = ['name', 'email', 'password', 'role'];
  return requiredFields.every(field => user[field] !== undefined && user[field] !== '');
};

const getAll = async (req, res) => {
  try {
    const users = await mongodb.getDatabase().db().collection('users').find().toArray();
    // never return passwords
    const safeUsers = users.map(({ password, ...rest }) => rest);
    res.status(200).json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const users = await mongodb.getDatabase().db().collection('users').find({ _id: id }).toArray();
    if (!users.length) return res.status(404).json({ message: 'User not found' });

    // never return password
    const { password, ...safeUser } = users[0];
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = req.body;
    if (!validateUser(user)) return res.status(400).json({ message: 'Missing required fields: name, email, password, role' });

    // hash the password before storing
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
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
    if (!validateUser(user)) return res.status(400).json({ message: 'Missing required fields: name, email, password, role' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

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