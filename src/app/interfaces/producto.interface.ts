export interface Producto {
  clave: string;
  descripcion: string;
  precioNetoSinIVA: number;
  precioNetoConIVA: number;
  msrp: number;
  disponibilidad: string;
  categoria: 'BOARD_GAMES' | 'TCG' | 'ACCESORIOS';
  marca?: string;
}

export interface ResultadoProcesamiento {
  productos: Producto[];
  marcas: string[];
}
