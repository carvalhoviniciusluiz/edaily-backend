'use strict'

const Matter = use('App/Schemas/Matter')

class MatterController {
  async index ({ request }) {
    const matters = await Matter.paginate(request.all(), {}, '-__v -pages -createdAt')

    return {
      ...matters,
      data: matters.data.map(matter => ({
        id: matter._id,
        file: {
          name: matter.file.name
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