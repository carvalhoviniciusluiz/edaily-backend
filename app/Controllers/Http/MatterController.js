'use strict'

const Matter = use('App/Schemas/Matter')

class MatterController {
  async index ({ request }) {
    const matters = await Matter.paginate(request.all(), {
      forwarded_at: { $exists: false },
      canceled_at: { $exists: false }
    }, '-__v -pages -updatedAt')

    return {
      ...matters,
      data: matters.data.map(matter => ({
        id: matter._id,
        file: {
          id: matter.file.uuid,
          name: matter.file.name,
          url: matter.file.url
        },
        author: {
          firstname: matter.author.firstname,
          lastname: matter.author.lastname
        },
        organization: {
          initials: matter.organization.initials
        },
        createdAt: matter.createdAt
      }))
    }
  }
}

module.exports = MatterController
