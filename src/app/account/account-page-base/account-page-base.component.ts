import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {IParticlesProps} from "ng-particles/lib/ng-particles.module";

@Component({
  selector: 'app-account-page-base',
  templateUrl: './account-page-base.component.html',
  styleUrls: ['./account-page-base.component.scss']
})
export class AccountPageBaseComponent implements OnInit {

  public cool = 'anc';

  public readonly particlesOptions: IParticlesProps = {
    particles: {
      color: {
        value: "#007f00"
      },
      links: {
        color: "#007f00",
        distance: 250,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      move: {
        direction: "none",
        enable: true,
        outModes: "bounce",
        random: false,
        speed: 2,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 2000
        },
        value: 80
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: "circle"
      },
      size: {
        value: {min: 1, max: 5}
      }
    },
    detectRetina: true
  };

  constructor(
    @Inject(LOCALE_ID) public locale: string
  ) {
    console.log(this.locale)
  }

  ngOnInit() {
    // the particles need an id -> every should be unique -> on navigation particles are recreated
    // -> this ensures that the id is different
    this.cool = String(Math.round(Math.random() * 1000));
  }
}
