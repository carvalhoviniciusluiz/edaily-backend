'use strict'

const Mail = use('Mail')
const Env = use('Env')
const Helpers = use('Helpers')

class SendAccountModificationEmail {
  static get concurrency () {
    return 2
  }

  static get key () {
    return 'SendAccountModificationEmail-job'
  }

  async handle ({ user, avatar, hasAttachment }) {
    console.log(`Job: ${SendAccountModificationEmail.key}`)

    await Mail.send(
      ['emails.update_user'],
      {
        user,
        hasAttachment
      },
      message => {
        message
          .to(user.email, user.name)
          .from(
            Env.get('MAIL_FROM', 'notreply@edaily.com'),
            Env.get('MAIL_LOCAL', 'Team | Edaily')
          )
          .subject('Conta atualizada')

        if (hasAttachment) {
          message.attach(Helpers.tmpPath(`uploads/${avatar.file}`), {
            filename: avatar.name
          })
        }
      }
    )
  }
}

module.exports = SendAccountModificationEmail
