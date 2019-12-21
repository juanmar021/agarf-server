import Servidor from './server/servidor';
import rutasPersonas from './rutas/persona.router';
 
import rutasCategorias from './rutas/categoria.router';
import rutasPlanes from './rutas/plan.router';
import rutasDias from './rutas/dia.router';
import rutasEjercicios from './rutas/ejercicio.router';
import rutasAlimentos from './rutas/alimento.router';




const servidor: Servidor = Servidor.getInstancia(3000);


servidor.agregarRutas( new Map([
         ['/deportistas', rutasPersonas],
         ['/categorias', rutasCategorias],
         ['/planes', rutasPlanes],
         ['/dias', rutasDias],
         ['/ejercicios', rutasEjercicios],
         ['/alimentos', rutasAlimentos]
         
         


]));

servidor.iniciar(() => console.log(`Servidor corriendo`));