import * as nodemailer from 'nodemailer'
// import SMTPTransport from 'nodemailer/lib/smtp-transport'

interface IEmailMessage {
  from: string
  to: string
  subject: string
  html?: string
}

export class EmailService {
  message: IEmailMessage

  constructor(to: string, subject: string, body: string) {
    this.message = {
      from: `${process.env.TRANSPORTER_NAME} <${process.env.TRANSPORTER_AUTH_USER}>`,
      to,
      subject,
      html: `<html>
        <head>
          <style>
            body {
              background-color: #E5E5E5;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 16px;
            }
            #content,
            #footer {
              width: 90%;
              max-width: 500px;
              padding: 20px;
              margin: 0 auto;
            }
            #content {
              background-color: #FFFFFF;
            }
            #footer {
              padding-top: 30px;
              color: #999999;
              font-size: 12px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div id="content">
            <p>${body}</p>
            <p>${process.env.TRANSPORTER_NAME}</p>
          </div>
          <div id="footer">
            © ${new Date().getFullYear()} ${process.env.TRANSPORTER_NAME}
          </div>
        </body>
      </html>`,
    }
  }

  sendMail(): void {
    nodemailer
      .createTransport({
        service: process.env.TRANSPORTER_SERVICE,
        auth: {
          user: process.env.TRANSPORTER_AUTH_USER,
          pass: process.env.TRANSPORTER_AUTH_PASS,
        },
      })
      .sendMail(this.message, (error: Error | null /*, info: SMTPTransport.SentMessageInfo*/) => {
        if (error) throw new Error('RESET_PASSWORD.EMAIL.ERROR')
      })
  }
}
