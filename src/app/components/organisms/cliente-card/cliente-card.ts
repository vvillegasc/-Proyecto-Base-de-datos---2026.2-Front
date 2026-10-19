import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Avatar } from '../../atoms/avatar/avatar';
import { Button } from '../../atoms/button/button';
import { ClienteResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-cliente-card',
  imports: [Avatar, Button],
  templateUrl: './cliente-card.html',
  styleUrl: './cliente-card.css',
})
export class ClienteCard {
  @Input() cliente!: ClienteResponseDTO;
  @Output() editar = new EventEmitter<ClienteResponseDTO>();
  @Output() eliminar = new EventEmitter<number>();
}
