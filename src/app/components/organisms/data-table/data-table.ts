import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { EmptyState } from '../../molecules/empty-state/empty-state';

export interface TableColumn {
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

/**
 * Tabla genérica: define las columnas y pasa las celdas de cada fila con un ng-template.
 *
 * <app-data-table [columns]="columnas" [rows]="facturas">
 *   <ng-template let-f>
 *     <td>{{ f.numFactura }}</td> ...
 *   </ng-template>
 * </app-data-table>
 */
@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet, EmptyState],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T> {
  @Input() columns: TableColumn[] = [];
  @Input() rows: T[] = [];
  @Input() emptyTitle = 'Sin registros';
  @Input() emptyMessage = '';
  @ContentChild(TemplateRef) rowTemplate!: TemplateRef<{ $implicit: T; index: number }>;
}
