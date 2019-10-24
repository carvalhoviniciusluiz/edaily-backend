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
      data: matters.data.map(matter => {
        const data = {
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
          createdAt: matter.createdAt
        }

        const organizationExists = !!matter.organization

        if (organizationExists) {
          data.organization = {
            initials: matter.organization.initials
          }
        }

        return data
      })
    }
  }

  async update ({ params, auth }) {
    const matter = await Matter.findById(params.id)
    const { uuid, firstname, lastname, email } = auth.user
    matter.responsable = {
      uuid,
      firstname,
      lastname,
      email
    }
    matter.forwarded_at = new Date()
    await matter.save()
  }
}

module.exports = MatterController
