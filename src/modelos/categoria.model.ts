import MySql from '../datos/MySql';
 const jwt = require('jsonwebtoken');
 import * as bcrypt from 'bcryptjs';
 

 import {  ID, TABLA_DEPORTISTAS, NOMBRE, EDAD_MINIMA, EDAD_MAXIMA, TABLA_CATEGORIAS } from '../utils/constantes';
import {  Categoria } from '../utils/interfaces';


export class CategoriaModel {

   
    public static async registrar(categoria: Categoria){
         return  MySql.getInstancia().query(
            `INSERT INTO ${TABLA_CATEGORIAS} 
            (${NOMBRE}, ${EDAD_MINIMA}, ${EDAD_MAXIMA})
                VALUES (?,?,?);`,
            [ 
                 categoria.nombre.toUpperCase(),
                categoria.edad_minima,
                categoria.edad_maxima  
              
            ]
        );
        
 
    }

    
   
 
    public static async editar(categoria: Categoria){
        let result= await MySql.getInstancia().query(
            `UPDATE  ${TABLA_CATEGORIAS}  SET  ${NOMBRE}=?, ${EDAD_MINIMA}=?, ${EDAD_MAXIMA}=?
               WHERE ${ID}=?
             `,
            [
                categoria.nombre.toUpperCase(),
                categoria.edad_minima,
                categoria.edad_maxima,
                categoria.id.toString()
             ]
        );
     
        return result;
        }

        
        public static async listar(){
            let result= await MySql.getInstancia().query(
                `SELECT * FROM ${TABLA_CATEGORIAS}
                 `,
                []
            );
         
            return result;
            }
    
            public static async getCategoria(id:string){
                 let result= await MySql.getInstancia().query(
                    `SELECT * FROM ${TABLA_CATEGORIAS} WHERE ${ID}=${id}
                     `,
                    []
                );
 
                return result;
                }


}