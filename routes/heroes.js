const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearHeroe,
        obtenerHeroes,
        obtenerHeroe,
        actualizarHeroe, 
        borrarHeroe, 
        obtenerImagenesHeroe,
        agregarImagenHeroe,
        eliminarImagenHeroe  } = require('../controllers/heroes');
const { existeHeroePorId } = require('../helpers/db-validators');

const router = Router();

//  Obtener todas las Opciones - publico
router.get('/', obtenerHeroes );


// Obtener una Opcion por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,
], obtenerHeroe );

// Crear Opcion - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre del heroe es obligatorio').not().isEmpty(),
    validarCampos
], crearHeroe );

// Actualizar Role- privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos
],actualizarHeroe );

// Borrar un Role - Admin
router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,
],borrarHeroe);

// En routes/heroes.js - Añadir estas rutas
router.get('/:id/images', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeHeroePorId),
    validarCampos,
], obtenerImagenesHeroe);

router.post('/:id/images', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeHeroePorId),
    check('imageUrl', 'La URL de la imagen es obligatoria').not().isEmpty(),
    validarCampos,
], agregarImagenHeroe);

router.delete('/:id/images/:imageIndex', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeHeroePorId),
    check('imageIndex', 'El índice de la imagen es obligatorio').isNumeric(),
    validarCampos,
], eliminarImagenHeroe);

module.exports = router;