import { CurrencyPipe } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Producto } from '../../../../interfaces/producto.interface';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [TableModule, CurrencyPipe],
  templateUrl: './tabla-productos.component.html',
  styleUrl: './tabla-productos.component.scss',
})
export class TablaProductosComponent {
  @Input() productos: Producto[] = [];
  @Input() filtroTexto = '';
  @Input() marca?: string;

  productosFiltrados = computed(() =>
    this.productos.filter(
      (p) =>
        (!this.marca || p.marca === this.marca) &&
        p.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase())
    )
  );
}
