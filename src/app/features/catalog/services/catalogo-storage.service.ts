import { Injectable } from '@angular/core';
import { ResultadoProcesamiento } from '../../../interfaces/producto.interface';
import { CatalogoStorage } from '../../../interfaces/catalogo-storage.model';

const STORAGE_KEY = 'catalogo_productos';

@Injectable({
  providedIn: 'root',
})
export class CatalogoStorageService {
  private readonly VERSION = 1;

  constructor() {}

  save(data: ResultadoProcesamiento[]): void {
    const payload: CatalogoStorage = {
      version: this.VERSION,
      fechaCarga: new Date().toISOString(),
      data,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  load(): CatalogoStorage | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as CatalogoStorage;
      if (parsed.version !== this.VERSION) {
        this.clear();
        return null;
      }
      return parsed;
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  hasData(): boolean {
    return !!this.load();
  }
}
