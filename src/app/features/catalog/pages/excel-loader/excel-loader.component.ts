import { Component } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ExcelCatalogService } from '../../services/excel-catalog.service';
import { Router } from '@angular/router';
import { CatalogoStorageService } from '../../services/catalogo-storage.service';

@Component({
  selector: 'app-excel-loader',
  standalone: true,
  imports: [
    FileUploadModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FormsModule,
  ],
  templateUrl: './excel-loader.component.html',
  styleUrl: './excel-loader.component.scss',
})
export class ExcelLoaderComponent {
  excelUrl = '';

  constructor(
    private excelService: ExcelCatalogService,
    private storage: CatalogoStorageService,
    private router: Router
  ) {}

  async onFileSelect(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    // Placeholder: aquí después conectamos el procesamiento
    console.log('Archivo seleccionado:', file);
    const resultado = await this.excelService.procesarArchivo(file);

    this.storage.save(resultado);

    this.router.navigate(['/catalogo']);
  }

  onLoadFromUrl() {
    if (!this.excelUrl) return;

    // Placeholder: aquí después conectamos la descarga
    console.log('URL ingresada:', this.excelUrl);
  }
}
