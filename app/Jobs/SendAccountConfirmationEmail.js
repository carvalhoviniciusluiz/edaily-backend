'use strict'

const Mail = use('Mail')
const Env = use('Env')

class SendAccountConfirmationEmail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'SendAccountConfirmationEmail-job'
  }

  async handle ({ user, password, team }) {
    console.log(`Job: ${SendAccountConfirmationEmail.key} - ${user.email}`)

    await Mail.send(
      ['emails.confirmation_instructions'],
      {
        user,
        password,
        team
      },
      message => {
        message
          .to(user.email, user.name)
          .from(
            Env.get('MAIL_FROM', 'notreply@edaily.com'),
            Env.get('MAIL_LOCAL', 'Team | Edaily')
          )
          .subject('Confirmação de conta')
      }
    )
  }
}

module.exports = SendAccountConfirmationEmail
