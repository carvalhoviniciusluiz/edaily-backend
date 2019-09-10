'use strict'

const uuid = require('uuid')

const Kue = use('Kue')
const JobAccountModification = use('App/Jobs/SendAccountModificationEmail')
const Env = use('Env')
const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.configPasswordAndUUID = async user => {
  if (!user.uuid) {
    user.uuid = uuid.v4()
  }

  if (user.dirty.password) {
    user.password = await Hash.make(user.password)
  }
}

UserHook.sendAccountModificationEmail = async user => {
  if (!user.dirty.token && Env.get('NODE_ENV') !== 'testing') {
    const avatar = await user.avatar().fetch()

    Kue.dispatch(JobAccountModification.key, {
      user,
      avatar,
      hasAttachment: !!avatar
    }, { attempts: 3 })
  }
}
