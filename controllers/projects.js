const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateProject = (project) => {
  const requiredFields = ['name', 'description', 'ownerId'];
  return requiredFields.every(field => project[field] !== undefined && project[field] !== '');
};

const getAll = async (req, res) => {
  try {
    const projects = await mongodb.getDatabase().db().collection('projects').find().toArray();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const projects = await mongodb.getDatabase().db().collection('projects').find({ _id: id }).toArray();
    if (!projects.length) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(projects[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = req.body;
    if (!validateProject(project)) return res.status(400).json({ message: 'Missing required fields: name, description, ownerId' });

    project.members = project.members || [];
    project.createdAt = new Date();
    const response = await mongodb.getDatabase().db().collection('projects').insertOne(project);
    res.status(201).json({ message: 'Project created', id: response.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const project = req.body;
    if (!validateProject(project)) return res.status(400).json({ message: 'Missing required fields: name, description, ownerId' });

    const response = await mongodb.getDatabase().db().collection('projects').replaceOne({ _id: id }, project);
    if (response.modifiedCount === 0) return res.status(404).json({ message: 'Project not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('projects').deleteOne({ _id: id });
    if (response.deletedCount === 0) return res.status(404).json({ message: 'Project not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createProject, updateProject, deleteProject };