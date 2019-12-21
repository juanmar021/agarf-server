 export interface Deportista {
   id: number;
   pass: string;
   nombres: string;
   apellidos: string;
   fecha_nacimiento: string;
   estatura: string;
   sexo: string;
   estado:string;
 }
 export interface Categoria {
   id: number;
   nombre: string;
   edad_maxima: string;
   edad_minima: string;
 
}
export interface Dias {
  id: number;
  id_plan: number;
  recomendaciones: string;
  dia: string;

}
export interface Planes {
  id: number;
  id_categoria: number;
  tipo: string;
  numero_semanas: number;

}
export interface Ejercicios {
  id: number;
  id_dia: number;
  nombre: string;
  numero_series: number;
  numero_repeticiones: number;
  descripcion:string;
  sugerencias:string;
}
export interface Alimentos {
  id: number;
  id_dia: number;
  nombre: string;
  hora_maxima: number;
  hora_minima: number;
  contenido:string;
  tipo_comida:string;
  prioridad:string;
  recomendaciones:string;

}

