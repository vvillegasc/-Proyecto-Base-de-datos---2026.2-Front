import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface RangoFechas {
  desde: string;
  hasta: string;
}

@Component({
  selector: 'app-date-range-filter',
  imports: [],
  templateUrl: './date-range-filter.html',
  styleUrl: './date-range-filter.css',
})
export class DateRangeFilter {
  @Input() desde = '';
  @Input() hasta = '';
  @Output() rangeChange = new EventEmitter<RangoFechas>();

  onDesde(event: Event): void {
    this.desde = (event.target as HTMLInputElement).value;
    this.rangeChange.emit({ desde: this.desde, hasta: this.hasta });
  }

  onHasta(event: Event): void {
    this.hasta = (event.target as HTMLInputElement).value;
    this.rangeChange.emit({ desde: this.desde, hasta: this.hasta });
  }

  limpiar(): void {
    this.desde = '';
    this.hasta = '';
    this.rangeChange.emit({ desde: '', hasta: '' });
  }
}
