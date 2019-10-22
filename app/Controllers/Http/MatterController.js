'use strict'

const Matter = use('App/Schemas/Matter')

class MatterController {
  async index ({ request }) {
    const matters = await Matter.paginate(request.all(), {}, '-__v -pages -createdAt')

    return matters.map(matter => ({
      ...matter,
      data: {
        id: matter.data._id,
        file: {
          name: matter.data.file.name
        },
        author: {
          firstname: matter.data.author.firstname,
          lastname: matter.data.author.lastname
        },
        organization: {
          initials: matter.data.organization.initials
        },
        createdAt: matter.data.createdAt
      }
    }))
  }
}

module.exports = MatterController
