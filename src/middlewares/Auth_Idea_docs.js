// @AUTH DOCS

const ENTITIES = {
  SUPER_ADMIN: 'superAdmin',
  CUSTOMER: 'customer',
}

const ROLES = {
  SUPER_ADMIN: ['superAdmin', 'superAdminMaintainer'],
  CUSTOMER: ['customer'],
};

const routes = {
  DEALER: {
    accessedBy: [ENTITIES.DEALER, ENTITIES.DEALERSHIP, ENTITIES.SUPER_ADMIN],
    routes: [
      {
        path: '/api/v1/dealer',
        methods: 'POST',
        requiredRights: ['createDealer'],
        permissions: {
          [ENTITIES.SUPER_ADMIN]: none,
          [ENTITIES.DEALERSHIP]: none,
          [ENTITIES.DEALER]: none,
        }
      }
    ]

  }
}
