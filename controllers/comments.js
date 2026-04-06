const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateComment = (comment) => {
  const requiredFields = ['taskId', 'userId', 'content'];
  return requiredFields.every(field => comment[field] !== undefined && comment[field] !== '');
};

const getAll = async (req, res) => {
  try {
    const comments = await mongodb.getDatabase().db().collection('comments').find().toArray();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const comments = await mongodb.getDatabase().db().collection('comments').find({ _id: id }).toArray();
    if (!comments.length) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json(comments[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = req.body;
    if (!validateComment(comment)) return res.status(400).json({ message: 'Missing required fields: taskId, userId, content' });

    comment.createdAt = new Date();
    const response = await mongodb.getDatabase().db().collection('comments').insertOne(comment);
    res.status(201).json({ message: 'Comment created', id: response.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const comment = req.body;
    if (!validateComment(comment)) return res.status(400).json({ message: 'Missing required fields: taskId, userId, content' });

    const response = await mongodb.getDatabase().db().collection('comments').replaceOne({ _id: id }, comment);
    if (response.modifiedCount === 0) return res.status(404).json({ message: 'Comment not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('comments').deleteOne({ _id: id });
    if (response.deletedCount === 0) return res.status(404).json({ message: 'Comment not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createComment, updateComment, deleteComment };