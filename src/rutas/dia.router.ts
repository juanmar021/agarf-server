import { Router, Response, Request } from 'express';
import { DiaModel } from '../modelos/dia.model';
     
const rutas: Router = Router();


/* [ INICIO ] MIDDLEWARES PARA TODAS LAS RUTAS */
//rutas.use(validarToken);
/* [ FIN ] MIDDLEWARES PARA TODAS LAS RUTAS */
 
rutas.post('/registrar',(req: Request, res: Response) => {
 
    DiaModel.registrar(req.body)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Dia registrado exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Dia NO registrado"
                })
            }
        })
        .catch( (err:any) => {
            console.log('Error en registro Dia', err);

            let respError = {
                "okay": false,
                "mensaje": "Error desconocido"
            }

            console.log(err)
            if ( err.code == 'ER_DUP_ENTRY') {
                respError.mensaje = "Ya existe un dia con ese ID ";
            } else if ( err.code == 'ER_BAD_NULL_ERROR' ) {
                respError.mensaje = "Columna nula";
            } else if ( err.code == 'ER_DATA_TOO_LONG' ) { // Este error se dio en el server remoto en aws
                respError.mensaje = "Datos demasiado largos";
            }

            res.json(respError);
        });
});

 
   
 
 

rutas.put('/editar',async (req: any, res: Response) => {
   
    DiaModel.editar(req.body)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Dia editado exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Dia NO editado"
                })
            }
        })
        .catch( (err:any )=> {
            console.log('Error en editar Dia', err);

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
 

rutas.get('/listar',async (req: any, res: Response) => {
    
    listar().then((resp:any)=>
    {

        res.json({
            "okay": true,
            "respuesta": resp
        });
        

    }).catch( err => {
        console.log('Error al obtener los planes', err);

        let respError = {
            "okay": false,
            "mensaje": "Error desconocido"
        }     
        res.json(respError);
    });
    
   
});


let listar =async()=>
{
 
    const dias= await DiaModel.listar();
 
    return dias;
}


export default rutas;