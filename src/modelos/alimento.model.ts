import MySql from '../datos/MySql';
import { Alimentos } from '../utils/interfaces';
import { TABLA_ALIMENTOS, ID_DIA, HORA_MINIMA, HORA_MAXIMA, CONTENIDO, TIPO_COMIDA, PRIORIDAD, RECOMENDACIONES, ID } from '../utils/constantes';
 
    

export class AlimentoModel {

   
    public static async registrar(alimento: Alimentos){
         return  MySql.getInstancia().query(
            `INSERT INTO ${TABLA_ALIMENTOS} 
            (${ID_DIA}, ${HORA_MINIMA}, ${HORA_MAXIMA},${CONTENIDO},${TIPO_COMIDA},${PRIORIDAD},${RECOMENDACIONES})
                VALUES (?,?,?,?,?,?,?);`,
            [ 
                 alimento.id_dia.toString(),
                 alimento.hora_minima.toString(),
                 alimento.hora_maxima.toString(),
                 alimento.contenido.toUpperCase(),
                 alimento.tipo_comida.toUpperCase(),
                 alimento.prioridad.toUpperCase(),
                 alimento.recomendaciones.toUpperCase()
              
            ]
        );
        
 
    }

    
   
 
    public static async editar(alimento: Alimentos){
        let result= await MySql.getInstancia().query(
            `UPDATE ${ID_DIA}=?, ${HORA_MINIMA}=?, ${HORA_MAXIMA}=?,
            ${CONTENIDO}=?,${TIPO_COMIDA}=?,${PRIORIDAD}=?,${RECOMENDACIONES}=?            
               WHERE ${ID}=?
             `,
            [
                alimento.id_dia.toString(),
                 alimento.hora_minima.toString(),
                 alimento.hora_maxima.toString(),
                 alimento.contenido.toUpperCase(),
                 alimento.tipo_comida.toUpperCase(),
                 alimento.prioridad.toUpperCase(),
                 alimento.recomendaciones.toUpperCase(),
                 alimento.id.toString()
             ]
        );
     
        return result;
        }

        
        public static async listar(){
            let result= await MySql.getInstancia().query(
                `SELECT * FROM ${TABLA_ALIMENTOS}
                 `,
                []
            );
         
            return result;
            }
            public static async getAlimento(id:string){
                let result= await MySql.getInstancia().query(
                   `SELECT * FROM ${TABLA_ALIMENTOS} WHERE ${ID}=${id}
                    `,
                   []
               );

               return result;
               }
            public static async getAlimentossDia(id:string){
                let result= await MySql.getInstancia().query(
                   `SELECT * FROM ${TABLA_ALIMENTOS} WHERE ${ID_DIA}=${id}
                    `,
                   []
               );

               return result;
               }

               
 


}