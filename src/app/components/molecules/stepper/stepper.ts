import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  imports: [],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
})
export class Stepper {
  @Input() pasos: string[] = [];
  @Input() actual = 0;
}
