const nodemailer = require("nodemailer");
require("dotenv").config({ path: "variables.env" });

const emailRegistro = async (datos) => {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } catch (error) {
    console.log("Error al enviar el correo: ", error);
  }

  const { email, nombre, token } = datos;
  const baseUrl = `${process.env.BACKEND_URL}:${process.env.PORT}`;

  // Enviar email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu Cuenta en BienesRaices.com",
    text: "Confirma tu Cuenta en BienesRaices.com",
    html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

            <p>
                <a 
                  href="${baseUrl}/confirmar/${token}" 
                  target="_blank"
                >Confirmar Cuenta</a>
            </p>

            <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>
        `,
  });
};

module.exports = emailRegistro;
