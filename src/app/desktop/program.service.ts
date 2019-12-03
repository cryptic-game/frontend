import { Position } from '../../dataclasses/position';
import { Program } from '../../dataclasses/program';
import { Injectable } from '@angular/core';
import { desktopDefinition, programWindows } from '../../assets/desktop/definition';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  programs: Program[] = [];

  list() {
    if (!localStorage.getItem('desktop')) {
      localStorage.setItem('desktop', btoa(JSON.stringify(desktopDefinition)));
      this.programs = desktopDefinition.programs;
    } else {
      this.programs = JSON.parse(atob(localStorage.getItem('desktop')))['programs'].map((el: any) => new Program(
        el.id,
        programWindows[el.id],
        el.displayName,
        el.icon,
        el.onDesktop,
        new Position(el.position.x, el.position.y, el.position.z)
      ));

      desktopDefinition.programs.forEach(programDef => {
        if (!this.programs.find(program => program.id === programDef.id)) {
          this.programs.push(programDef);
        }
      });

      this.programs = this.programs.filter(program => desktopDefinition.programs.find(programDef => programDef.id === program.id));
    }

    return this.programs;
  }

  update() {
    const desktop = JSON.parse(atob(localStorage.getItem('desktop')));
    desktop['programs'] = this.programs;

    localStorage.setItem('desktop', btoa(JSON.stringify(desktop)));
  }
}
