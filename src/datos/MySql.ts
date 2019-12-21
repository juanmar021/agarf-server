import mysql = require('mysql');
import { Promise } from 'core-js';
 
/**
 * Patrón SINGLETON 
 */
export default class MySql {
    private static _instancia: MySql;

    conexion: mysql.Connection;

    private constructor() {
       
        this.conexion = mysql.createConnection({
            
            host: process.env.ROYMAR_HOST_BD || 'localhost',
            user: process.env.ROYMAR_USER_DB || 'root',
            password: process.env.ROYMAR_PASS_BD || '',
            database: process.env.ROYMAR_NAME_DB || 'agarf',
            dateStrings: true
        });

        this.conexion.connect( (error: mysql.MysqlError) => {
            if(error){
                console.log(`Error en la conexión de la base de datos ${ error }`);
                return;
            }

            console.log(`Base de datos conectada`);
            
        });
    }

    public static getInstancia(): MySql{
        if(this._instancia){
            return this._instancia;
        }else{
            this._instancia = new MySql();
            return this._instancia;
        }
    }

    public query(sql: string, args: string[]): Promise<any>{
        return new Promise( (resolve: Function, reject: Function) => {
            this.conexion.query(sql, args, (error, filas) => {
                if(error) return reject(error);

                resolve(filas);
            });
        });
    }

    public close(): Promise<any>{
        return new Promise( (resolve: Function, reject: Function) => {
            this.conexion.end( (err: mysql.MysqlError) => {
                if(err) return reject(err);
                resolve();
            });
        });
    }
}
