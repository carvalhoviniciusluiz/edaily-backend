'use strict'

const Mail = use('Mail')
const Env = use('Env')

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers')

const UserHook = exports = module.exports = {}

UserHook.sendUpdateUserMail = async user => {
  if (!user.dirty.token && Env.get('NODE_ENV') !== 'testing') {
    const organization = await user.organization().fetch()
    const avatar = await user.avatar().fetch()

    await Mail.send(
      ['emails.update_user'],
      {
        user,
        organization,
        hasAttachment: !!avatar,
        hasOrganization: !!organization.id
      },
      message => {
        message
          .to(user.email, user.name)
          .from(
            Env.get('MAIL_FROM', 'notreply@edaily.com'),
            Env.get('MAIL_LOCAL', 'Team | Edaily')
          )
          .subject('Conta atualizada')

        if (avatar) {
          message.attach(Helpers.tmpPath(`uploads/${avatar.file}`), {
            filename: avatar.name
          })
        }
      }
    )
  }
}
