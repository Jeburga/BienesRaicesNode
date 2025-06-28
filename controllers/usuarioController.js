const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const generarId = require("../helpers/tokens");
const { emailRegistro, emailOlvidePassword } = require("../helpers/emails");

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
    token: generarId(),
  });

  // Envía Email de confirmacion
  emailRegistro({
    nombre,
    email,
    token: usuario.token,
  });

  //   Mostrar mensaje
  res.render("./templates/mensaje", {
    page: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un correo de confirmación, accede al enlace",
  });
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  // Verificar si token es válido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("./auth/confirmar-cuenta", {
      page: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta",
      error: true,
    });
  }

  // confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("./auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmo correctamente",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("./auth/olvide-password", {
    page: "Recupera tu acceso a Bienes Raíces",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("./auth/olvide-password", {
      pagina: "Olvide Password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // Buscar usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render("./auth/olvide-password", {
      page: "Olvide Password",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no pertenece a ningún usuario" }],
    });
  }

  // Generar un token y enviar un email
  usuario.token = generarId();
  await usuario.save();

  // Enviar un email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  // Renderizar un mensaje
  res.render("./templates/mensaje", {
    page: "Reestablece tu password",
    mensaje: "Hemos enviado un email con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("./auth/confirmar-cuenta", {
      page: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu información, intenta de nuevo",
      error: true,
    });
  }

  // Mostrar form para modificar el password
  res.render("./auth/reset-password", {
    page: "Reestablece tu password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  // Validar password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password muy débil, intenta de nuevo")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("./auth/reset-password", {
      page: "Reestablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // Identificar quien hace el cambio (para reescribir password)
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ where: { token } });

  // Hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash( password, salt );

  // Eliminar token - para evitar que vuelvan a acceder
  usuario.token = null;
  await usuario.save();

  res.render('auth/confirmar-cuenta', {
    page: 'Password reestablecido',
    mensaje: 'El password se guardó correctamente'
  })
};

module.exports = {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
