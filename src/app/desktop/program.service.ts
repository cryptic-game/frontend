import {Position} from '../../dataclasses/position';
import {Program} from '../../dataclasses/program';
import { Injectable } from '@angular/core';
import { desktopDefinition } from '../../assets/desktop/definition';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  list() {
    if (!localStorage.getItem('desktop')) {
      localStorage.setItem('desktop', btoa(JSON.stringify(desktopDefinition)));
    }

    const programs: Program[] = [];
    Object.values(
      JSON.parse(atob(localStorage.getItem('desktop')))['programs']
    ).forEach((el: any) => {
      const program: Program = new Program(
        el.displayname,
        el.icon,
        el.program,
        el.onDesktop,
        new Position(el.position.x, el.position.y, el.position.z)
      );
      programs.push(program);
    });

    return programs;
  }

  update(data: Program) {
    const desktop = JSON.parse(atob(localStorage.getItem('desktop')));
    const programs = desktop['programs'];
    programs[data.displayName] = data;

    localStorage.setItem('desktop', btoa(JSON.stringify(desktop)));
  }
}
