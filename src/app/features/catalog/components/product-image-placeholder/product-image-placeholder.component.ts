import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-image-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-image-placeholder.component.html',
  styleUrl: './product-image-placeholder.component.scss',
})
export class ProductImagePlaceholderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
