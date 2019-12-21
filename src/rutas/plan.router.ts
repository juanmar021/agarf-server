import { Router, Response, Request } from 'express';
import { PlanModel } from '../modelos/plan.model';
import { CategoriaModel } from '../modelos/categoria.model';
import { DiaModel } from '../modelos/dia.model';
import { EjercicioModel } from '../modelos/ejercicio.model';
import { AlimentoModel } from '../modelos/alimento.model';
import { PersonaModel } from '../modelos/persona.model';
import { Categoria } from '../utils/interfaces';
    
const rutas: Router = Router();


/* [ INICIO ] MIDDLEWARES PARA TODAS LAS RUTAS */
//rutas.use(validarToken);
/* [ FIN ] MIDDLEWARES PARA TODAS LAS RUTAS */
 
rutas.post('/registrar',(req: Request, res: Response) => {
 
    PlanModel.registrar(req.body)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Plan registrado exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Plan NO registrado"
                })
            }
        })
        .catch( (err:any) => {
            console.log('Error en registro Plan', err);

            let respError = {
                "okay": false,
                "mensaje": "Error desconocido"
            }

            console.log(err)
            if ( err.code == 'ER_DUP_ENTRY') {
                respError.mensaje = "Ya existe un plan con ese ID ";
            } else if ( err.code == 'ER_BAD_NULL_ERROR' ) {
                respError.mensaje = "Columna nula";
            } else if ( err.code == 'ER_DATA_TOO_LONG' ) { // Este error se dio en el server remoto en aws
                respError.mensaje = "Datos demasiado largos";
            }

            res.json(respError);
        });
});

 
   
 
 

rutas.put('/editar',async (req: any, res: Response) => {
   
    PlanModel.editar(req.body)
        .then( (resp:any) => {

            if( resp.affectedRows > 0 ){
                res.json({
                    "okay": true,
                    "mensaje": "Plan editado exitosamente"
                });
            }else{
                res.json({
                    "okay": false,
                    "mensaje": "Plan NO editado"
                })
            }
        })
        .catch( (err:any )=> {
            console.log('Error en editar Plan', err);

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

rutas.get('/listar/:id',async (req: any, res: Response) => {
    
    getPlan(req.params.id).then((resp:any)=>
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

rutas.get('/listar/mis_planes/:id',async (req: any, res: Response) => {
    
    getMisPlanes(req.params.id).then((resp:any)=>
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

rutas.get('/generar/:id',async (req: any, res: Response) => {
    
    generarPlan(req.params.id).then((resp:any)=>
    {

        res.json({
            "okay": true,
            "mensaje": resp
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
let generarPlan=async(id_deportista:string)=>{
    const deportista=await PersonaModel.identificar(id_deportista);

    
    const planes= await PlanModel.getPlanesCategoria(deportista[0].categoria);


    for(let plan of planes)
    {
      
     const resp=await PlanModel.registrarPlanDeportista(deportista[0].id,plan.id);


  




    //  for(let dia of dias){
    //     if(plan.tipo==="ENTRENAMIENTO"){
    //         const ejercicios= await EjercicioModel.getEjerciciosDia(dia.id);
    //         dia.ejercicios=ejercicios;
    //      }else{
    //         const alimentos= await AlimentoModel.getAlimentossDia(dia.id);
    //         dia.alimentos=alimentos;
    //      }

    //  }
    //  plan.categoria=categoria[0];
    //  plan.dias=dias;

 
    }

     if(planes.length===0){
            return {deportista:deportista[0],planes};
 
     } 

      
        return(
             
            "Se han generado los planes"
         );
   
 

 }

 let getMisPlanes=async(id_deportista:string)=>{
 
    
    const planes= await PlanModel.getMisPlanes(id_deportista);


    for(let plan of planes)
    {
        const dias = await DiaModel.getDiasPlan(plan.id_plan);
        for(let dia of dias){
  
           if(plan.tipo==="ENTRENAMIENTO"){
              const ejercicios= await EjercicioModel.getEjerciciosDia(dia.id);
              dia.ejercicios=ejercicios;
           }else{
              const alimentos= await AlimentoModel.getAlimentossDia(dia.id);
              dia.alimentos=alimentos;
           }
          
  
          
  
       }
        plan.dias=dias;
    }
      
 
    return {planes};
 

 }

let getPlan =async(id:string)=>
{

    const plan= await PlanModel.getPlan(id);


  
     const categoria=await CategoriaModel.getCategoria(plan[0].id_categoria);
     const dias = await DiaModel.getDiasPlan(id);
      for(let dia of dias){

         if(plan[0].tipo==="ENTRENAMIENTO"){
            const ejercicios= await EjercicioModel.getEjerciciosDia(dia.id);
            dia.ejercicios=ejercicios;
         }else{
            const alimentos= await AlimentoModel.getAlimentossDia(dia.id);
            dia.alimentos=alimentos;
         }
        

        

     }
     plan[0].categoria=categoria[0];
     plan[0].dias=dias;
 
    return plan;
}


let listar =async()=>
{

    const planes= await PlanModel.listar();


    for(let plan of planes)
    {
     const categoria=await CategoriaModel.getCategoria(plan.id_categoria);
     const dias = await DiaModel.getDiasPlan(plan.id);
     for(let dia of dias){
        if(plan.tipo==="ENTRENAMIENTO"){
            const ejercicios= await EjercicioModel.getEjerciciosDia(dia.id);
            dia.ejercicios=ejercicios;
         }else{
            const alimentos= await AlimentoModel.getAlimentossDia(dia.id);
            dia.alimentos=alimentos;
         }

     }
     plan.categoria=categoria[0];
     plan.dias=dias;



 
    }

    return planes;
}


export default rutas;