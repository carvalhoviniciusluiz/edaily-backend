'use strict'

const uuid = require('uuid')

const Env = use('Env')
const Hash = use('Hash')
const Kue = use('Kue')
const JobAccountModification = use('App/Jobs/SendAccountModificationEmail')

const UserHook = exports = module.exports = {}

UserHook.configurePasswordAndUUID = async user => {
  if (!user.uuid) {
    user.uuid = uuid.v4()
  }

  if (user.dirty.password) {
    user.password = await Hash.make(user.password)
  }
}

UserHook.sendAccountModificationEmail = async user => {
  if (!user.dirty.recovery_token &&
    !user.dirty.confirmed_at &&
    !user.dirty.sign_in_count &&
    Env.get('NODE_ENV') !== 'testing') {
    const avatar = await user.avatar().fetch()

    Kue.dispatch(JobAccountModification.key, {
      user,
      avatar,
      hasAttachment: !!avatar,
      team: Env.get('APP_NAME', 'Edaily')
    }, { attempts: 3 })
  }
}
