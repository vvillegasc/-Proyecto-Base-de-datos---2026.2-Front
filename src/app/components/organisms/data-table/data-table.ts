import { Component, ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { EmptyState } from '../../molecules/empty-state/empty-state';

export interface TableColumn {
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

@Directive({ selector: 'ng-template[appTableRow]' })
export class TableRow<T> {
  @Input() appTableRow: T[] = [];

  static ngTemplateContextGuard<T>(_dir: TableRow<T>, _ctx: unknown): _ctx is { $implicit: T; index: number } {
    return true;
  }
}

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
