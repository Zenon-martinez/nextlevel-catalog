import { Routes } from '@angular/router';
import { ExcelLoaderComponent } from './features/catalog/pages/excel-loader/excel-loader.component';
import { CatalogComponent } from './features/catalog/pages/catalog/catalog.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    component: ExcelLoaderComponent,
    data: { breadcrumb: 'Inicio' },
  },
  {
    path: 'catalogo',
    component: CatalogComponent,
    data: { breadcrumb: 'Catálogo' },
  },
];
