import express = require('express');
import http = require('http');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import { Router } from "express";
 
 
 



export default class Servidor {

    private server: http.Server;
    private app: express.Application;
    private puerto: number;
 
    
    private static instancia: Servidor;

    constructor( puerto: number ) {
        this.puerto = puerto;
        this.app = express();

 
        
        this.app.use( function (req, res, next) {
            // Permite a cualquier origen conectarse
            res.setHeader('Access-Control-Allow-Origin', '*');
        
            // Los metodos permitidos
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            // Headers permitidas
            res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');

            // Pasamos a los siguientes middlewares
            next();
        });

        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.server = http.createServer(this.app);// creamos un servidor http manejado por express        
      
    }

    public static getInstancia( puerto: number): Servidor{
        if (this.instancia) {
            return this.instancia;
        } else {
            this.instancia = new Servidor(puerto);

            return this.instancia;
        }
    }

    public agregarRutas(rutas: Map<string, Router>){
        rutas.forEach((enrutador: Router, rutaRaiz: string) => {
            this.app.use(rutaRaiz, enrutador);
        });
    }

    public iniciar(callback: IFunction): void{

        this.server.listen(this.puerto, callback);
             
    }


   
 
    
}

interface IFunction {
    (): void;
}