const allRoles = {
  superAdmin: [
    'manageAllCustomers',
  ],
  customer: [
    'manageCustomer',
  ]
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
