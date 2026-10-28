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
    { titulo: 'Déjanos tus datos', texto: 'Te asignamos una mesa según el número de personas.' },
    { titulo: 'Recibe tu código', texto: 'Tu reserva queda registrada y te llega la confirmación al correo.' },
  ];
}
