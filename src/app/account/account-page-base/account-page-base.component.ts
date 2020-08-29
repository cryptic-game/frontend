import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Particles from 'particlesjs/src/particles.js';

@Component({
  selector: 'app-account-page-base',
  templateUrl: './account-page-base.component.html',
  styleUrls: ['./account-page-base.component.scss']
})
export class AccountPageBaseComponent implements OnInit, OnDestroy {

  private particles: Particles;

  ngOnInit(): void {
    this.particles = Particles.init({
      selector: 'canvas',
      maxParticles: 450,
      color: '#007f00',
      speed: 0.5
    });
  }

  ngOnDestroy(): void {
    this.particles.destroy();
  }
}
