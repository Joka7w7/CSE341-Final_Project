const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'TaskFlow API',
    description: 'API for managing tasks, projects, users, and comments',
  },
  host: 'taskflow-api.onrender.com', // ← update this after Render deploy
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/index.js',
  './routes/users.js',
  './routes/projects.js',
  './routes/tasks.js',
  './routes/comments.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);