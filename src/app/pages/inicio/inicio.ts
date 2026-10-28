import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicLayout } from '../../components/templates/public-layout/public-layout';

@Component({
  selector: 'app-inicio',
  imports: [PublicLayout, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  readonly pasos = [
    { titulo: 'Elige fecha y hora', texto: 'Dinos cuándo vienes y cuántas personas son.' },
    { titulo: 'Escoge tu mesa', texto: 'Te mostramos las mesas libres para ese horario.' },
    { titulo: 'Recibe tu código', texto: 'Con tus datos de contacto, tu reserva queda registrada.' },
  ];
}
