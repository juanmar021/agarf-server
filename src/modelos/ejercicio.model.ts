import MySql from '../datos/MySql';
 
 import { Dias, Ejercicios } from '../utils/interfaces';
import { TABLA_EJERCICIOS, ID_DIA, NOMBRE, DESCRIPCION, NUMERO_SERIES, NUMERO_REPETICIONES, SUGERENCIAS, ID } from '../utils/constantes';
  

export class EjercicioModel {

   
    public static async registrar(ejercicio: Ejercicios){
         return  MySql.getInstancia().query(
            `INSERT INTO ${TABLA_EJERCICIOS} 
            (${ID_DIA}, ${NOMBRE}, ${DESCRIPCION},${NUMERO_SERIES},${NUMERO_REPETICIONES},${SUGERENCIAS})
                VALUES (?,?,?,?,?,?);`,
            [ 
                 ejercicio.id_dia.toString(),
                 ejercicio.nombre.toUpperCase(),
                 ejercicio.descripcion.toUpperCase(),
                 ejercicio.numero_series.toString(),
                 ejercicio.numero_repeticiones.toString(),
                 ejercicio.sugerencias.toString()
              
            ]
        );
        
 
    }

    
   
 
    public static async editar(ejercicio: Ejercicios){
        let result= await MySql.getInstancia().query(
            `UPDATE  ${TABLA_EJERCICIOS}  SET  ${ID_DIA}=?, ${NOMBRE}=?, ${DESCRIPCION}=?,${NUMERO_SERIES}=?
            ,${NUMERO_REPETICIONES}=?,${SUGERENCIAS}=?
               WHERE ${ID}=?
             `,
            [
                 ejercicio.id_dia.toString(),
                 ejercicio.nombre.toUpperCase(),
                 ejercicio.descripcion.toUpperCase(),
                 ejercicio.numero_series.toString(),
                 ejercicio.numero_repeticiones.toString(),
                 ejercicio.sugerencias.toString(),
                 ejercicio.id.toString()
             ]
        );
     
        return result;
        }

        
        public static async listar(){
            let result= await MySql.getInstancia().query(
                `SELECT * FROM ${TABLA_EJERCICIOS}
                 `,
                []
            );
         
            return result;
            }
            public static async getEjercicio(id:string){
                let result= await MySql.getInstancia().query(
                   `SELECT * FROM ${TABLA_EJERCICIOS} WHERE ${ID}=${id}
                    `,
                   []
               );

               return result;
               }
            public static async getEjerciciosDia(id:string){
                let result= await MySql.getInstancia().query(
                   `SELECT * FROM ${TABLA_EJERCICIOS} WHERE ${ID_DIA}=${id}
                    `,
                   []
               );

               return result;
               }

               
 


}