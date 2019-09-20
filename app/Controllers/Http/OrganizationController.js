'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const UserHelper = require('../Helpers/UserHelper')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class OrganizationController {
  async index ({ request }) {
    const { page } = request.get('page')
    const { limit } = request.get('limit')

    const organizations = await Organization
      .query()
      .with('users')
      .with('author')
      .with('revisor')
      .paginate(page, limit)

    return organizations
  }

  async store ({ request }) {
    const {
      responsible_firstname: firstname,
      responsible_lastname: lastname,
      responsible_email: email,
      responsible_cpf: cpf,
      responsible_rg: rg,
      responsible_phone: phone,
      responsible_zipcode: zipcode,
      responsible_street: street,
      responsible_street_number: streetNumber,
      responsible_neighborhood: neighborhood,
      responsible_city: city,
      responsible_state: state,
      ...rest
    } = request.all()

    const data = {
      firstname,
      lastname,
      email,
      cpf,
      rg,
      phone,
      zipcode,
      street,
      street_number: streetNumber,
      neighborhood,
      city,
      state,
      is_responsible: true
    }

    const user = await UserHelper.register(data)

    const organization = await Organization.create({
      ...rest,
      author_id: user.id,
      revisor_id: user.id
    })

    user.organization_id = organization.id
    await user.save()

    await organization.load('file')
    await organization.load('users')
    await organization.load('author')
    await organization.load('revisor')

    return organization
  }

  async show ({ params, response }) {
    try {
      const organization = await Organization.findByOrFail('uuid', params.id)

      await organization.load('author')
      await organization.load('revisor')
      await organization.load('users')
      await organization.load('file')

      return organization
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Organização não localizada.' } })
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      const organization = await Organization.findByOrFail('uuid', params.id)

      const data = request.only([
        'name',
        'initials',
        'cnpj',
        'billing_email',
        'phone1',
        'phone2'
      ])

      organization.merge({
        ...data,
        revisor_id: auth.user.id
      })

      await organization.save()

      await organization.load('author')
      await organization.load('revisor')
      await organization.load('users')
      await organization.load('file')

      return organization
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Organização não encontrada.' } })
    }
  }

  async destroy ({ params }) {
    // const organization = await Organization.findByOrFail('uuid', params.id)
    // await organization.delete()
  }
}

module.exports = OrganizationController
