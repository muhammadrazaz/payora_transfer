const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');

const router = express.Router();
//specs includes all route
const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/lib/v1/*/*.route.js'],
});

//specs_tools only related to inventory
const specs_tools = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml'],
});

// Serve Swagger UI assets
router.use('/', swaggerUi.serve);

//Ticket Create documentation of Inventory API [CBA-26]
//Route to deliver for the inventory
router.get(
  '/',
  swaggerUi.setup(specs_tools, {
    explorer: true,
  })
);

// Define route for general API documentation
// router.get(
//   '/api-docs',
//   swaggerUi.setup(specs, {
//     explorer: true,
//   })
// );

module.exports = router;
