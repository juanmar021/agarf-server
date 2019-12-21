const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { SEED, ROL_ADMIN } from '../utils/constantes';
 
/**
 * Verifica que el token que viene en la cabecera es valido, en caso de serlo
 * pasa al siguiente middleware o peticion, de lo contrario retorna json invalido
 */
export const validarToken = (req: any, res: Response, next: Function ) => {
    let token = req.get('Authorization');
 
     jwt.verify(token, SEED, (error:any, decodificacion: any) => {
       
        if(error) {
            return res.json({
                'okay': false,
                'respuesta': 'token invalido'
            });
        }
        req.usuario = decodificacion.usuario;
        next();
 
    })
}
 
/**
 * Valida que el rol sea unica y exclusicamene de administrador 
 */
export const validarRolAdmin = (req: any, res: Response, next: Function) => {
    let rol = req.usuario.rol;
 
    if( rol == ROL_ADMIN ) {
        next();
    }else{

        return res.json({
            'okay': false,
            'respuesta': 'No tiene permisos'
        });
    }
}

   


 