import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'error' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(message: string, type: 'error' | 'success' = 'error'): void {
    const id = Date.now();
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number): void {
    this.toasts.update(t => t.filter(m => m.id !== id));
  }
}
