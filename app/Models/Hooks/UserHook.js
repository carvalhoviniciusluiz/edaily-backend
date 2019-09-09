'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/SendAccountModificationEmail')
const Env = use('Env')

const UserHook = exports = module.exports = {}

UserHook.sendAccountModificationEmail = async user => {
  if (!user.dirty.token && Env.get('NODE_ENV') !== 'testing') {
    const avatar = await user.avatar().fetch()

    Kue.dispatch(Job.key, {
      user,
      avatar,
      hasAttachment: !!avatar
    }, { attempts: 3 })
  }
}
