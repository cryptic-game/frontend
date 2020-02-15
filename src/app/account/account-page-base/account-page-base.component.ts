import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Particles from 'particlesjs/src/particles.js';

@Component({
  selector: 'app-account-page-base',
  templateUrl: './account-page-base.component.html',
  styleUrls: ['./account-page-base.component.scss']
})
export class AccountPageBaseComponent implements OnInit, OnDestroy {

  private p: Particles;

  constructor() {
  }

  ngOnInit(): void {
    this.p = Particles.init({
      selector: 'canvas',
      maxParticles: 450,
      color: '#007f00',
      speed: 0.5
    });
    console.log(this.p);
  }

  ngOnDestroy(): void {
    this.p.destroy();
  }
}
