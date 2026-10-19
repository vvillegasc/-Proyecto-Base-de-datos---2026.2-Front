import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Tab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tab-filter',
  imports: [],
  templateUrl: './tab-filter.html',
  styleUrl: './tab-filter.css',
})
export class TabFilter {
  @Input() tabs: Tab[] = [];
  @Input() active = '';
  @Output() tabChange = new EventEmitter<string>();
}
