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

  async handle ({ name, email, token, link }) {
    console.log(`Job: ${SendForgotPasswordMail.key}`)

    await Mail.send(
      ['emails.forgot_password'],
      { email, token, link },
      message => {
        message
          .to(email, name)
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
