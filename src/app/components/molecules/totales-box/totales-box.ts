import { Component, Input } from '@angular/core';
import { PrecioPipe } from '../../../pipes/precio.pipe';

@Component({
  selector: 'app-totales-box',
  imports: [PrecioPipe],
  templateUrl: './totales-box.html',
  styleUrl: './totales-box.css',
})
export class TotalesBox {
  @Input() subtotal = 0;
  @Input() impuesto = 0;
  @Input() propina = 0;
  @Input() total = 0;
}
