'use strict'

const Mail = use('Mail')
const Env = use('Env')

class SendForgotPasswordMail {
  static get concurrency () {
    return 2
  }

  static get key () {
    return 'SendForgotPasswordMail-job'
  }

  async handle ({ user, link, team }) {
    console.log(`Job: ${SendForgotPasswordMail.key} - ${user.email}`)

    await Mail.send(
      ['emails.forgot_password'],
      {
        user,
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
          .subject('Recuperação de senha')
      }
    )
  }
}

module.exports = SendForgotPasswordMail
