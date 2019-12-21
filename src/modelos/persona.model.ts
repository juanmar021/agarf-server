import MySql from '../datos/MySql';
 const jwt = require('jsonwebtoken');
 import * as bcrypt from 'bcryptjs';
 

 import { NOMBRES, ID, APELLIDOS, TELEFONO,  PASS, NUM_VUELTAS,  SEED, ESTADO, FECHA_NACIMIENTO, ESTATURA, SEXO, TABLA_DEPORTISTAS } from '../utils/constantes';
import { Deportista } from '../utils/interfaces';


export class PersonaModel {

    public static async login(id: string, pass: string) {
        let resp = await MySql.getInstancia().query(
            `SELECT ${ID},  ${NOMBRES}, ${APELLIDOS},DATE_FORMAT(${FECHA_NACIMIENTO},'%d/%m/%Y') as fecha_nacimiento ,${ESTATURA},${SEXO},${PASS},
            getEdad(fecha_nacimiento) as edad , getCategoria(id) as categoria 
                    FROM ${TABLA_DEPORTISTAS}
                    WHERE ${ID} = ? and ${ESTADO} != 'ELIMINADO';`,
            [ id ]
        );

        if( resp.length > 0 ) {
            let deportista = resp[0];

            // Comparamos el hash de la contraseña
            if( bcrypt.compareSync( pass, deportista.pass ) ) {
                // Quitamos la contraseña de la respuesta para no mostrarla 
                deportista.pass = undefined; 
                

                // Generamos un token con la info del deportista en el payload
                let token = jwt.sign(
                    { 'deportista': deportista }, SEED
                );

                deportista.token=token;             

                return {
                    "okay": true,
                    "respuesta": {deportista}
                };
            
            } else {
                return {
                    "okay": false,
                    "mensaje": "Credenciales incorrectas"
                };
            }
            
        } else {

            return {
                "okay": false,
                "mensaje": "El Deportista no existe"
            };
        }
    }

    
      
    public static async registrar(deportista: Deportista){
         return  MySql.getInstancia().query(
            `INSERT INTO ${TABLA_DEPORTISTAS} 
            (${ID},  ${NOMBRES}, ${APELLIDOS}, ${FECHA_NACIMIENTO},${ESTATURA},${SEXO},${PASS} )
                VALUES (?,?,?,?,?,?,?);`,
            [ 
                deportista.id.toString(),
                deportista.nombres.toUpperCase(),
                deportista.apellidos.toUpperCase(),
                deportista.fecha_nacimiento,
                deportista.estatura,
                deportista.sexo,              
                bcrypt.hashSync( deportista.pass, NUM_VUELTAS )
 
              
            ]
        );
        
 
    }

    

//     //VALIDA LA CLAVE DE UN USUARIO PARA ACTUALIZARLA
    public static async validarPass(id: string, pass: string) {
        let resp = await MySql.getInstancia().query(
            `SELECT ${ID}, ${PASS}
                    FROM ${TABLA_DEPORTISTAS}
                    WHERE ${ID} = ?;`,
            [ id ]
        );

        if( resp.length > 0 ) {
            let usuario = resp[0];

            // Comparamos el hash de la contraseña
            if( bcrypt.compareSync( pass, usuario.pass ) ) {
                 
                return true;

            } else {
                return false;
            }
            
        }  
    }

     
     public static async cambiarPass(id:string,pass:string){
       let result= await MySql.getInstancia().query(
           `UPDATE  ${TABLA_DEPORTISTAS} SET ${PASS} = ?
           WHERE ${ID}=?
            `,
           [ 
               bcrypt.hashSync(pass, NUM_VUELTAS ),
               id          
                        
           ]
       );
    
       
       return result;
   }
   
   public static async listar(){
    let result= await MySql.getInstancia().query(
        `SELECT ${ID},  ${NOMBRES}, ${APELLIDOS}, ${FECHA_NACIMIENTO},${ESTATURA},${SEXO} ,
        getEdad(fecha_nacimiento) as edad , getCategoria(id) as categoria 
                FROM ${TABLA_DEPORTISTAS}
         `,
        [      
        ]
    );
 
    
    return result;
}

    public static async editar(deportista: Deportista){
        let result= await MySql.getInstancia().query(
            `UPDATE  ${TABLA_DEPORTISTAS}  SET   ${NOMBRES}=?, ${APELLIDOS}=?, ${FECHA_NACIMIENTO}=?,${ESTATURA}=?,${SEXO}=?
               WHERE ${ID}=?
             `,
            [
                deportista.nombres.toUpperCase(),
                deportista.apellidos.toUpperCase(),
                deportista.fecha_nacimiento,
                deportista.estatura,
                deportista.sexo, 
                deportista.id.toString()
             ]
        );
     
        return result;
        }

        
   public static async identificar(id:string){
    let result= await MySql.getInstancia().query(
        `SELECT  ${ID},  ${NOMBRES}, ${APELLIDOS}, ${FECHA_NACIMIENTO},${ESTATURA},${SEXO} ,
        getEdad(fecha_nacimiento) as edad , getCategoria(id) as categoria  FROM  ${TABLA_DEPORTISTAS} WHERE ${ID}=?
         `,
        [id]
    );
 
    result[0].pass=undefined;
 
    
    return result;
}
 
 
// public static async eliminar(id:string){
//     let result= await MySql.getInstancia().query(
//         `UPDATE ${TABLA_PERSONAS} SET ${ESTADO}='ELIMINADO' WHERE ${ID}=?
//          `,
//         [id]
//     );
 
    
//     return result;
// }
   
 


}