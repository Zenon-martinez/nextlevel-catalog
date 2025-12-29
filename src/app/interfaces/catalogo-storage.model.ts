import { ResultadoProcesamiento } from './producto.interface';

export interface CatalogoStorage {
  version: number;
  fechaCarga: string;
  data: ResultadoProcesamiento[];
}
