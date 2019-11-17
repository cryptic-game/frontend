import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hardware-shop-item',
  templateUrl: './hardware-shop-item.component.html',
  styleUrls: ['./hardware-shop-item.component.scss']
})
export class HardwareShopItemComponent implements OnInit {

  @Input() name: string;
  @Input() price: string;

  constructor() { }

  ngOnInit() {
  }
}
