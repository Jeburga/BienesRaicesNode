
const admin = (req, res) => {
    res.render('./propiedades/admin', {
        page: 'Mis Propiedades',
        barra: true
    })
}

// Formulario para crear nueva propiedad
const crear = (req, res) => {
    res.render('./ppropiedades/crear', {
        page: 'Crear Propiedad',
        barra: true
    })
}

module.exports = { 
    admin,
    crear
};