import MySql from '../datos/MySql';
 
 import {  Dias } from '../utils/interfaces';
import { TABLA_DIAS, ID_PLAN, RECOMENDACIONES, DIA, ID } from '../utils/constantes';
 

export class DiaModel {

   
    public static async registrar(dia: Dias){
         return  MySql.getInstancia().query(
            `INSERT INTO ${TABLA_DIAS} 
            (${ID_PLAN}, ${RECOMENDACIONES}, ${DIA})
                VALUES (?,?,?);`,
            [ 
                 dia.id_plan.toString(),
                 dia.recomendaciones.toUpperCase(),
                 dia.dia.toUpperCase()
              
            ]
        );
        
 
    }

    
   
 
    public static async editar(dia: Dias){
        let result= await MySql.getInstancia().query(
            `UPDATE  ${TABLA_DIAS}  SET  ${ID_PLAN}=?, ${RECOMENDACIONES}=?, ${DIA}=?
               WHERE ${ID}=?
             `,
            [
                dia.id_plan.toString(),
                dia.recomendaciones.toUpperCase(),
                dia.dia.toUpperCase(),             
                dia.id.toString()
             ]
        );
     
        return result;
        }

        
        public static async listar(){
            let result= await MySql.getInstancia().query(
                `SELECT * FROM ${TABLA_DIAS}
                 `,
                []
            );
         
            return result;
            }
            public static async getDia(id:string){
                let result= await MySql.getInstancia().query(
                   `SELECT * FROM ${TABLA_DIAS} WHERE ${ID}=${id}
                    `,
                   []
               );

               return result;
               }
            public static async getDiasPlan(id:string){
                let result= await MySql.getInstancia().query(
                   `SELECT * FROM ${TABLA_DIAS} WHERE ${ID_PLAN}=${id}
                    `,
                   []
               );

               return result;
               }

               
 


}