import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  imports: [],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
})
export class Stepper {
  @Input() pasos: string[] = [];
  // Índice del paso actual (0 = primero).
  @Input() actual = 0;
}
