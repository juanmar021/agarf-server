import { Router, Response, Request } from 'express';
import { CategoriaModel } from '../modelos/categoria.model';
    
const rutas: Router = Router();


/* [ INICIO ] MIDDLEWARES PARA TODAS LAS RUTAS */
//rutas.use(validarToken);
/* [ FIN ] MIDDLEWARES PARA TODAS LAS RUTAS */
 
rutas.post('/registrar',(req: Request, res: Response) => {
    let Categoria = req.body;

    CategoriaModel.registrar(Categoria)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Categoria registrada exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Categoria NO registrada"
                })
            }
        })
        .catch( (err:any) => {
            console.log('Error en registro Categoria', err);

            let respError = {
                "okay": false,
                "mensaje": "Error desconocido"
            }

            console.log(err)
            if ( err.code == 'ER_DUP_ENTRY') {
                respError.mensaje = "Ya existe una categoria con ese ID ";
            } else if ( err.code == 'ER_BAD_NULL_ERROR' ) {
                respError.mensaje = "Columna nula";
            } else if ( err.code == 'ER_DATA_TOO_LONG' ) { // Este error se dio en el server remoto en aws
                respError.mensaje = "Datos demasiado largos";
            }

            res.json(respError);
        });
});

 
   
 
 

rutas.put('/editar',async (req: any, res: Response) => {
    let cat = req.body;
  
    CategoriaModel.editar(cat)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Categoria editada exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Categoria NO editada"
                })
            }
        })
        .catch( (err:any )=> {
            console.log('Error en editar Categoria', err);

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
    
    CategoriaModel.listar().then((resp:any)=>
    {

        res.json({
            "okay": true,
            "respuesta": resp
        });
        

    }).catch( err => {
        console.log('Error al obtener las categorias', err);

        let respError = {
            "okay": false,
            "mensaje": "Error desconocido"
        }     
        res.json(respError);
    });
    
   
});


export default rutas;