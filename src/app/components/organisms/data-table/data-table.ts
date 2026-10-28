import { Component, ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { EmptyState } from '../../molecules/empty-state/empty-state';

export interface TableColumn {
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

/**
 * Solo sirve para tipar la fila del ng-template (así `let-f` no es `any`).
 * Recibe las mismas filas que la tabla.
 */
@Directive({ selector: 'ng-template[appTableRow]' })
export class TableRow<T> {
  @Input() appTableRow: T[] = [];

  static ngTemplateContextGuard<T>(_dir: TableRow<T>, _ctx: unknown): _ctx is { $implicit: T; index: number } {
    return true;
  }
}

/**
 * Tabla genérica: define las columnas y pasa las celdas de cada fila con un ng-template.
 *
 * <app-data-table [columns]="columnas" [rows]="facturas">
 *   <ng-template [appTableRow]="facturas" let-f>
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
