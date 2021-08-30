import { Position } from '../../dataclasses/position';
import { Program } from '../../dataclasses/program';
import { Injectable } from '@angular/core';
import { desktopDefinition } from '../../assets/desktop/definition';
import { SettingService } from '../api/setting/setting.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  programs: Program[] = [];

  constructor(private settingService: SettingService) {
  }

  private static serializeProgramData(program: Program) {
    return JSON.stringify({
      onDesktop: program.onDesktop,
      position: {
        x: program.position.x,
        y: program.position.y,
        z: program.position.z
      }
    });
  }

  private static deserializeProgram(definition: Program, data: any) {
    return new Program(
      definition.id,
      definition.windowDelegate,
      definition.displayName,
      definition.icon,
      data?.onDesktop ?? definition.onDesktop,
      data?.position ?
        new Position(data.position.x, data.position.y, data.position.z) :
        definition.position
    );
  }

  private static saveToCache(program: Program) {
    localStorage.setItem(`program_${program.id}`, this.serializeProgramData(program));
  }

  private static loadProgramFromCache(definition: Program): Program {
    let savedProgram: any;

    try {
      savedProgram = JSON.parse(localStorage.getItem(`program_${definition.id}`));
    } catch (e) {
    }

    return this.deserializeProgram(definition, savedProgram);
  }

  loadCached(): Program[] {
    this.programs = desktopDefinition.programs.map(def => ProgramService.loadProgramFromCache(def));
    return this.programs;
  }

  async loadFresh(): Promise<Program[]> {
    // Doesn't work because of missing tags of server responses:
    // this.programs = await Promise.all(desktopDefinition.programs.map(def => this.loadProgram(def)));

    const programs = [];
    for (const def of desktopDefinition.programs) {
      const program = await this.loadProgram(def);
      programs.push(program);
      ProgramService.saveToCache(program);
    }
    this.programs = programs;
    return programs;
  }

  async loadProgram(definition: Program): Promise<Program> {
    let savedProgram: any;

    try {
      savedProgram = JSON.parse(await this.settingService.get(`program_${definition.id}`).toPromise());
    } catch (e) {
      if (e.message !== 'unknown setting') {
        console.warn(e);
      }
    }

    return ProgramService.deserializeProgram(definition, savedProgram);
  }

  async save(program: Program) {
    ProgramService.saveToCache(program);
    await this.settingService.set(`program_${program.id}`, JSON.stringify({
      onDesktop: program.onDesktop,
      position: program.position
    })).toPromise();
  }

}
