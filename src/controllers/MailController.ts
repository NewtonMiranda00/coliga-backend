import nodeMailer from 'nodemailer';
// import hbs from 'nodemailer-express-handlebars';
import { resolve } from 'path'; // Import => Gambiarra
import fs from 'fs'; // Import => Gambiarra
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

interface props {
  name: string
  email: string
}

const Transporter = nodeMailer.createTransport({
  host: process.env.HOST_EMAIL,
  port: Number(process.env.PORT_EMAIL),
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function getTransporter() {
  return Transporter;
}

function getTemplate(template: string, params: object) {
  let data = fs.readFileSync(
    resolve('src', 'resources', 'templates', `${template}.hbs`),
    'utf-8',
  );

  for (const key in params) {
    data = data.split(`{{${key}}}`).join(params[key]);
  }

  return data;
}

class MailController {
  async sendActiveAccount(code: string, params: props) {
    const transporter = getTransporter();

    /*
    Corrigir para compilar o handlebars
    Checar a Auth-Api já funcionando
    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: './src/resources/templates',
          layoutsDir: './src/resources/templates',
          defaultLayout: 'activate-account',
        },
        viewPath: './src/resources/templates',
        extName: '.hbs',
      }),
    );
    */
    const { name, email } = params;

    await transporter.sendMail({
      subject: `Activate your account from ${process.env.COMPANY_NAME}`,
      from: `${process.env.COMPANY_NAME} <${process.env.USER_EMAIL}>`,
      to: [email],
      html: getTemplate(
        'activate-account',
        {
          name: name.split(' ')[0],
          baseUrl: process.env.BASE_URL,
          code,
        },
      ), // Tirar depois da implementação do handlebars
    });
  }

  async sendTokenResetPassword(code: string, params: props) {
    const transporter = getTransporter();

    const { name, email } = params;

    await transporter.sendMail({
      subject: `Reset your ${process.env.COMPANY_NAME} account password`,
      from: `${process.env.COMPANY_NAME} <${process.env.USER_EMAIL}>`,
      to: [email],
      html: getTemplate(
        'reset-password',
        {
          name: name.split(' ')[0],
          baseUrl: process.env.BASE_URL,
          code,
        },
      ), // Tirar depois da implementação do handlebars
    });
  }
}

export default new MailController();