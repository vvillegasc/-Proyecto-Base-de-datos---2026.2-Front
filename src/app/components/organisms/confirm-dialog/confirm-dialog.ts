import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Modal } from '../modal/modal';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Modal, Button],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  @Input() visible = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = '';
  @Input() confirmLabel = 'CONFIRMAR';
  @Input() cancelLabel = 'CANCELAR';
  @Input() variant: 'danger' | 'primary' = 'danger';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
