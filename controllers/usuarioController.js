export const formularioLogin = (req, res) => {
    res.render('/auth/login', {
        page: 'Iniciar sesión'
    })
}

export const formularioRegistro = (req, res) => {
    res.render('./auth/registro', {
        page: 'Crear Cuenta'
    })
}