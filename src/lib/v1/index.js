const express = require('express');
const authRoute = require('./auth/auth.route');
const docsRoute = require('./docs.route');

// const superAdminRoute = require('./superAdmin/superAdmin.route');

const router = express.Router();

const authRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

// const ultraSuperAdminRoutes = [
//   {
//     path: '/super-admin',
//     route: superAdminRoute,
//   },
// ];

authRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

devRoutes.forEach((route) => {
  router.use(route.path, docsRoute);
});

module.exports = router;
