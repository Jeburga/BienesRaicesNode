const { check, validationResult } = require("express-validator");
const generarId  = require('../helpers/tokens');
const emailRegistro = require('../helpers/emails');

const Usuario = require("../models/Usuario");

const formularioLogin = (req, res) => {
  res.render("./auth/login", {
    page: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const formularioRegistro = (req, res) => {
  res.render("./auth/registro", {
    page: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);

  await check("email")
    .isEmail()
    .withMessage("Tienes que colocar un correo")
    .run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);

  await check("repetir")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no son iguales");
        }
        return true;
    })
    .run(req);

  let resultado = validationResult(req);

  //   Destructurar
  const { nombre, email, password } = req.body;

  // Verificar que el resultado esté vacío
  if (!resultado.isEmpty()) {
    return res.render("./auth/registro", {
      page: "Crear Cuenta",
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
      usuario: {
        nombre,
        email,
      },
    });
  }

  // Verificar que usuario no esté duplicado
  const existeUsuario = await Usuario.findOne({
    where: { email },
  });

  if (existeUsuario) {
    return res.render("./auth/registro", {
      page: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Almacenar usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
  });

  // Envía Email de confirmacion
  emailRegistro({
    nombre,
    email,
    token: usuario.token,
  });

//   Mostrar mensaje
res.render('./templates/mensaje', {
    page: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un correo de confirmación, accede al enlace'
})
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params

  // Verificar si token es válido
  const usuario = await Usuario.findOne({where : {token}});
  
  if(!usuario){
    return res.render('./auth/confirmar-cuenta', {
      page: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta',
      error: true,
    });
  }

  // confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render('./auth/confirmar-cuenta', {
    pagina: 'Cuenta Confirmada',
    mensaje: 'La cuenta se confirmo correctamente'
  })
}

const formularioOlvidePassword = (req, res) => {
  res.render("./auth/olvide-password", {
    page: "Recupera tu acceso a Bienes Raíces",
  });
};

module.exports = {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword
};
