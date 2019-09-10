'use strict'

const Mail = use('Mail')
const Env = use('Env')
const Helpers = use('Helpers')

class SendAccountConfirmationEmail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'SendAccountConfirmationEmail-job'
  }

  async handle ({ user, password, avatar, hasAttachment }) {
    console.log(`Job: ${SendAccountConfirmationEmail.key}`)

    await Mail.send(
      ['emails.confirmation_instructions'],
      {
        user,
        password,
        hasAttachment
      },
      message => {
        message
          .to(user.email, user.name)
          .from(
            Env.get('MAIL_FROM', 'notreply@edaily.com'),
            Env.get('MAIL_LOCAL', 'Team | Edaily')
          )
          .subject('Confirmação de conta')

        if (hasAttachment) {
          message.attach(Helpers.tmpPath(`uploads/${avatar.file}`), {
            filename: avatar.name
          })
        }
      }
    )
  }
}

module.exports = SendAccountConfirmationEmail
