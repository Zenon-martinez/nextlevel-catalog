import { Component } from '@angular/core';
import {
  Producto,
  ResultadoProcesamiento,
} from '../../../../interfaces/producto.interface';
import { CatalogoStorageService } from '../../services/catalogo-storage.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { TablaProductosComponent } from '../../components/tabla-productos/tabla-productos.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    TabViewModule,
    TablaProductosComponent,
    InputTextModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  data: ResultadoProcesamiento[] | null = null;
  productos: Producto[] = [];
  marcasDisponibles: string[] = [];

  filtroTexto = '';
  marcaSeleccionada?: string;
  marcasSeleccionadas: string[] = [];

  productosFiltrados: Producto[] = [];

  categorias = [
    { key: 'BOARD_GAMES', label: 'Juegos de mesa' },
    { key: 'TCG', label: 'TCG' },
    { key: 'ACCESORIOS', label: 'Accesorios' },
  ];

  constructor(private storage: CatalogoStorageService) {}

  ngOnInit() {
    const stored = this.storage.load();
    if (!stored) return;

    this.productos = stored.data.flatMap((r) => r.productos);
    this.marcasDisponibles = Array.from(
      new Set(stored.data.flatMap((r) => r.marcas))
    ).sort();
    this.productosFiltrados = [...this.productos];
  }

  productosPorCategoria(categoria: string): Producto[] {
    return this.productosFiltrados.filter((p) => p.categoria === categoria);
  }

  aplicarFiltroMarca() {
    this.productosFiltrados = this.productos.filter(
      (p: Producto) => p.marca === this.marcaSeleccionada
    );
  }

  aplicarFiltros() {
    this.productosFiltrados = this.productos.filter((producto: Producto) => {
      const coincideMarca = producto.marca === this.marcaSeleccionada;

      const coincideTexto =
        !this.filtroTexto ||
        producto.descripcion
          .toLowerCase()
          .includes(this.filtroTexto.toLowerCase());

      return coincideMarca && coincideTexto;
    });
  }
}
