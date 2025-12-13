module.exports = {

  /**
   * * ===============================================
   * PUBLIC
   * * ===============================================
   */
  'GET /api/v1/solution/faq': {
    action: 'solution/public/faq/get-all-faq',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
  'GET /api/v1/solution/faq/:id': {
    action: 'solution/public/faq/get-one-faq',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
  'PATCH /api/v1/solution/vote-useful/:id': {
    action: 'solution/public/faq/vote-useful',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
  'PATCH /api/v1/solution/vote-useless/:id': {
    action: 'solution/public/faq/vote-useless',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },



  'GET /api/v1/solution/faq-topic': {
    action: 'solution/public/faq-topic/get-all-faq-topics',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
  'GET /api/v1/solution/faq-topic/:id': {
    action: 'solution/public/faq-topic/get-one-faq-topic',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
  'GET /api/v1/solution/get-topics-platform': {
    action: 'solution/public/faq-topic/get-topics-by-platform',
    swagger: {
      tags: ['SOLUTION - PUBLIC'],
      'x-groups': ['restricted_endpoints']
    }
  },
};
