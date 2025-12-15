module.exports = {
  'PATCH /api/v1/solution/vote-useful/:id': {
    action: 'solution/public/faq/vote-useful',
    swagger: {
      tags: ['SOLUTION (FAQ) - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
  'PATCH /api/v1/solution/vote-useless/:id': {
    action: 'solution/public/faq/vote-useless',
    swagger: {
      tags: ['SOLUTION (FAQ) - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
};
