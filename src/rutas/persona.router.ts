import { Router, Response, Request } from 'express';
import { PersonaModel } from '../modelos/persona.model';
import { validarToken, validarRolAdmin } from '../middlewares/autorizacion.mw';
   
const rutas: Router = Router();


/* [ INICIO ] MIDDLEWARES PARA TODAS LAS RUTAS */
//rutas.use(validarToken);
/* [ FIN ] MIDDLEWARES PARA TODAS LAS RUTAS */

rutas.post('/login', (req: Request, res: Response) => {
    let id:string = req.body.id;
    let pass:string = req.body.pass;

    //console.log(id,pass,toke_notificacion);
    PersonaModel.login(id, pass)
        .then( (resp:any) => {
       
            res.json(resp);
        })
        .catch( (err:any )=> {
            console.log(err);
            res.json({
                "okay": false,
                "mensaje": "Error"
            });
        });
});
 
rutas.post('/cambiar-pass', (req: Request, res: Response) => {
    let id:string = req.body.id;
    let pass_old:string = req.body.pass_old;
    let pass_new:string = req.body.pass_new;

    PersonaModel.validarPass(id, pass_old)
        .then( (resp:any) => {
           if(resp)
           {
            // SI LA CLAVE COINCIDE ENTONCES SE PROCEDE A CAMBIAR
            PersonaModel.cambiarPass(id, pass_new).then( respUpdate =>
                {

                    if( respUpdate.affectedRows > 0)
                    {

                        res.json({
                            "okay": true,
                            "mensaje": "Clave actualizada"
                        });
                    }
                    else{
                        res.json({
                            "okay": false,
                            "mensaje": "Clave no actualizada"
                        })
                    }
                  



                }) .catch( (err:any )=> {

                    console.log(err);
                    res.json({
                        "okay": false,
                        "mensaje": "Error al actualizar la contraseña"
                    });
                });


          

           }
           else{

            res.json({
                "okay": false,
                "mensaje": "Contraseña incorrecta"
            });
           }
        })
        .catch( (err:any )=> {
            res.json({
                "okay": false,
                "mensaje": "Error"
            });
        });
});
 
rutas.post('/registrar',(req: Request, res: Response) => {
    let deportista = req.body;
    console.log(req.body)

    PersonaModel.registrar(deportista)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Deportista registrado exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Deportista NO registrado"
                })
            }
        })
        .catch( (err:any) => {
            console.log('Error en registro Deportista', err);

            let respError = {
                "okay": false,
                "mensaje": "Error desconocido"
            }

            console.log(err)
            if ( err.code == 'ER_DUP_ENTRY') {
                respError.mensaje = "Ya existe un deportista con ese ID ";
            } else if ( err.code == 'ER_BAD_NULL_ERROR' ) {
                respError.mensaje = "Columna nula";
            } else if ( err.code == 'ER_DATA_TOO_LONG' ) { // Este error se dio en el server remoto en aws
                respError.mensaje = "Datos demasiado largos";
            }

            res.json(respError);
        });
});

rutas.get('/listar',async (req: any, res: Response) => {
    
    PersonaModel.listar().then((resp:any)=>
    {

        res.json({
            "okay": true,
            "respuesta": {deportistas:resp}
        });
        

    }).catch( err => {
        console.log('Error al obtener los deportistas', err);

        let respError = {
            "okay": false,
            "mensaje": "Error desconocido"
        }     
        res.json(respError);
    });
    
   
});
//    rutas.delete('/eliminar/:id', validarToken,validarRolAdmin, async (req: Request, res: Response) => {
    
//     let id= req.params.id;
//     PersonaModel.eliminar(id).then((resp:any)=>
//     {

//         if( resp.affectedRows > 0 ){

//           res.json({
//             "okay": true,
//             "mensaje": "Usuario Eliminado"
//         });   

//         }else{
//             res.json({
//                 "okay": false,
//                 "mensaje": "No se pudo Eliminar el usuario"
//             });  
//         }
       
        

//     }).catch( (err:any) => {
//         console.log('Error al Eliminar usuario', err);

//         let respError = {
//             "okay": false,
//             "mensaje": "Error desconocido"
//         }     
//         res.json(respError);
//     });
    
   
// });



 
       
   
 
rutas.post('/identificar', validarToken, async (req: any, res: Response) => {
        // Si llega aquí es porque el token es valido
        res.json({
            "okay": true,
            "respuesta":  req.usuario 
        });
    
    
});
 
 
 
 
 

rutas.put('/editar',async (req: any, res: Response) => {
    let usuario = req.body;
  
    PersonaModel.editar(usuario)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Deportista editado exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Deportista NO editado"
                })
            }
        })
        .catch( (err:any )=> {
            console.log('Error en editar deportista', err);

            let respError = {
                "okay": false,
                "mensaje": "Error desconocido"
            }

             if ( err.code == 'ER_BAD_NULL_ERROR' ) {
                respError.mensaje = "Columna nula";
            } else if ( err.code == 'ER_DATA_TOO_LONG' ) { // Este error se dio en el server remoto en aws
                respError.mensaje = "Datos demasiado largos";
            }

            res.json(respError);
        });
});
 


export default rutas;