import { Injectable } from '@angular/core';
import {
  Producto,
  ResultadoProcesamiento,
} from '../../../interfaces/producto.interface';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelCatalogService {
  private readonly PESTANAS_VALIDAS = [
    { nombre: 'Board Games', categoria: 'BOARD_GAMES' as const },
    { nombre: 'TCG', categoria: 'TCG' as const },
    { nombre: 'Accesorios', categoria: 'ACCESORIOS' as const },
  ];

  private readonly HEADER_MAP: Record<string, string> = {
    Clave: 'clave',
    Descripción: 'descripcion',
    'Precio Neto (Sin IVA)': 'precioSinIva',
    'Precio Neto (Con IVA)': 'precioConIva',
    MSRP: 'msrp',
    Disponibilidad: 'disponibilidad',
  };

  descripcionesPorPestaña: Record<string, any> = {};

  constructor() {}

  async procesarArchivo(file: File): Promise<ResultadoProcesamiento[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    return this.PESTANAS_VALIDAS.map((pestana) =>
      this.procesarPestana(workbook, pestana.nombre, pestana.categoria)
    );
  }

  private procesarPestana(
    workbook: XLSX.WorkBook,
    nombrePestana: string,
    categoria: Producto['categoria']
  ): ResultadoProcesamiento {
    const sheet = workbook.Sheets[nombrePestana];
    if (!sheet) {
      return { productos: [], marcas: [] };
    }

    const filas: any[] = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
      raw: true,
    });

    const productos: Producto[] = [];
    const marcas = new Set<string>();
    let descripcionesPorMarca: { [marca: string]: string[] } = {};

    let marcaActual: string | undefined;

    for (let fila of filas) {
      fila = this.normalizeRow(fila);

      // 🔹 Fila de marca (solo una celda con texto)
      const esMarca = this.esFilaMarca(fila);
      if (esMarca) {
        console.log('Fila normalizada:', fila);
        marcaActual = this.obtenerTextoUnico(fila);
        marcas.add(marcaActual);
        continue;
      } else if (this.esFilaDescripcion(fila)) {
        if (!descripcionesPorMarca[marcaActual!]) {
          descripcionesPorMarca = {
            ...descripcionesPorMarca,
            [marcaActual!]: [this.obtenerTextoUnico(fila)],
          };
        } else {
          descripcionesPorMarca[marcaActual!].push(
            this.obtenerTextoUnico(fila)
          );
        }
      }

      // 🔹 Fila de producto válida
      if (!fila['clave'] || !fila['descripcion']) {
        continue;
      }

      productos.push({
        clave: String(fila['clave']).trim(),
        descripcion: String(fila['descripcion']).trim(),
        precioNetoSinIVA: Number(fila['precioSinIva']) || 0,
        precioNetoConIVA: Number(fila['precioConIva']) || 0,
        msrp: Number(fila['msrp']) || 0,
        disponibilidad: String(fila['disponibilidad'] ?? '').trim(),
        categoria,
        marca: marcaActual,
      });
    }
    this.descripcionesPorPestaña[nombrePestana] = descripcionesPorMarca;
    console.log('Descripciones por marca:', this.descripcionesPorPestaña);
    return {
      productos,
      marcas: Array.from(marcas).sort(),
    };
  }

  // ============================
  // Helpers privados
  // ============================

  private esFilaDescripcion(fila: any): boolean {
    const valores = Object.values(fila).filter((v) => v !== null && v !== '');
    return valores[0]!.toString().startsWith('**');
  }

  private esFilaMarca(fila: any): boolean {
    const valores = Object.values(fila).filter(
      (v: any) => v !== null && v.toString().trim() !== ''
    );
    return valores.length < 6 && !valores[0]!.toString().startsWith('**');
  }

  private obtenerTextoUnico(fila: any): string {
    return String(
      Object.values(fila).find(
        (v) => typeof v === 'string' && v.toString().trim()
      )
    ).trim();
  }

  private normalizeRow(row: Record<string, any>) {
    const normalized: any = {};

    Object.entries(row).forEach(([key, value]) => {
      if (key.startsWith('__EMPTY')) return;

      const cleanKey = key.trim();

      if (this.HEADER_MAP[cleanKey]) {
        normalized[this.HEADER_MAP[cleanKey]] = value;
      }
    });

    return normalized;
  }
}
