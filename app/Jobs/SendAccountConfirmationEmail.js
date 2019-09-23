'use strict'

const Mail = use('Mail')
const Env = use('Env')

class SendAccountConfirmationEmail {
  static get concurrency () {
    return 5
  }

  static get key () {
    return 'SendAccountConfirmationEmail-job'
  }

  async handle ({ user, password, link, team }) {
    try {
      console.log(`Job: ${SendAccountConfirmationEmail.key} - ${user.email}`)

      await Mail.send(
        ['emails.confirmation_instructions'],
        {
          user,
          password,
          link,
          team
        },
        message => {
          message
            .to(user.email, `${user.firstname} ${user.lastname}`)
            .from(
              Env.get('MAIL_FROM', 'notreply@edaily.com'),
              Env.get('MAIL_LOCAL', 'Team | Edaily')
            )
            .subject('Confirmação de conta')
        }
      )
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = SendAccountConfirmationEmail
