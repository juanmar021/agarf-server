import MySql from '../datos/MySql';
 
 import { Planes } from '../utils/interfaces';
import { TABLA_PLANES, ID_CATEGORIA, TIPO, NUMERO_SEMANAS, ID, TABLA_CATEGORIAS, NOMBRE, TABLA_DEPORTISTAS_PLANES, ID_DEPORTISTA, ID_PLAN, FECHA_INICIO } from '../utils/constantes';


export class PlanModel {

   
    public static async registrar(plan: Planes){
         return  MySql.getInstancia().query(
            `INSERT INTO ${TABLA_PLANES} 
            (${ID_CATEGORIA}, ${TIPO}, ${NUMERO_SEMANAS})
                VALUES (?,?,?);`,
            [ 
                 plan.id_categoria.toString(),
                 plan.tipo.toUpperCase(),
                 plan.numero_semanas.toString()
              
            ]
        );
        
 
    }
       
    public static async registrarPlanDeportista(id_deportista:string,id_plan:string){
        return  MySql.getInstancia().query(
           `INSERT INTO ${TABLA_DEPORTISTAS_PLANES} 
           (${ID_DEPORTISTA}, ${ID_PLAN}, ${FECHA_INICIO})
               VALUES (?,?,now());`,
           [ 
                id_deportista,
                id_plan
              
           ]
       );
       

   }

    
   
 
    public static async editar(plan: Planes){
        let result= await MySql.getInstancia().query(
            `UPDATE  ${TABLA_PLANES}  SET  ${ID_CATEGORIA}=?, ${TIPO}=?, ${NUMERO_SEMANAS}=?
               WHERE ${ID}=?
             `,
            [
                 plan.id_categoria.toString(),
                 plan.tipo.toUpperCase(),
                 plan.numero_semanas.toString(),
                 plan.id.toString()
             ]
        );
     
        return result;
        }

 

        
        public static async listar(){
            let result= await MySql.getInstancia().query(
                `SELECT * FROM ${TABLA_PLANES}
                 `,
                []
            );
         
            return result;
            }

            public static async getPlanesCategoria(categoria:string){
                let result= await MySql.getInstancia().query(
                    `SELECT ${TABLA_PLANES}.${ID},${ID_CATEGORIA}, ${TIPO}, ${NUMERO_SEMANAS} 
                    FROM ${TABLA_PLANES},${TABLA_CATEGORIAS} WHERE ${TABLA_CATEGORIAS}.id=${ID_CATEGORIA}  
                    and ${TABLA_CATEGORIAS}.${NOMBRE}=?
                     `,
                    [categoria]
                );
             
                return result;
                }

            public static async getPlan(id:string){
                let result= await MySql.getInstancia().query(
                    `SELECT * FROM ${TABLA_PLANES} WHERE ${ID}=?
                     `,
                    [id]
                );
             
                return result;
                }
 
                public static async getMisPlanes(id:string){

                    
                    let result= await MySql.getInstancia().query(
                        `SELECT ${ID_PLAN},${NUMERO_SEMANAS},${TIPO},
                         getEstadoPlan(${ID_DEPORTISTA},${ID_PLAN}) as estado,
                        getSemanasPlan(${ID_DEPORTISTA},${ID_PLAN})+1 as semana_actual,
                        getDiasPlan(${ID_DEPORTISTA},${ID_PLAN}) as dias_transcurridos, 
                        formatDate(${FECHA_INICIO}) as fecha_inicio  
                        FROM ${TABLA_DEPORTISTAS_PLANES},${TABLA_PLANES}
                         WHERE ${TABLA_PLANES}.${ID}=${ID_PLAN} and ${ID_DEPORTISTA}=? 
                         and  getEstadoPlan(${ID_DEPORTISTA},${ID_PLAN})='EN CURSO'
                         `,
                        [id]
                    );
                 
                    return result;
                    }


}