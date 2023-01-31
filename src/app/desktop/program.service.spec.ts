import { inject, TestBed } from '@angular/core/testing';

import { ProgramService } from './program.service';
import * as Definition from '../../assets/desktop/definition';
import { Program } from '../../dataclasses/program';
import { Position } from '../../dataclasses/position';
import { WindowComponent, WindowDelegate } from './window/window-delegate';
import { NEVER, of, throwError } from 'rxjs';
import { SettingService } from '../api/setting/setting.service';
import { Type } from '@angular/core';

function newTestProgram(data: Partial<Program> = {}): Program {
  return new Program(
    data.id ?? 'testProgram',
    data.windowDelegate ?? TestWindowDelegate,
    data.displayName ?? 'Test Program',
    data.icon ?? '',
    data.onDesktop ?? true,
    data.position ?? new Position(0, 0, 0)
  );
}

function settingKey(program: Program): string {
  return `program_${program.id}`;
}

describe('ProgramService', () => {
  const actualPrograms = Definition.desktopDefinition.programs.slice();
  let fakeLocalStorage: any;
  let settingService: any; //TODO: Type me correct

  beforeEach(() => {
    fakeLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key) => fakeLocalStorage[key]);
    spyOn(localStorage, 'setItem').and.callFake((k, v) => (fakeLocalStorage[k] = v));

    settingService = jasmine.createSpyObj('SettingService', ['get', 'set', 'delete']);
    settingService.get.and.returnValue(NEVER);
    settingService.set.and.returnValue(of({ success: true }));
    settingService.delete.and.returnValue(NEVER);

    TestBed.configureTestingModule({
      providers: [ProgramService, { provide: SettingService, useValue: settingService }],
    });
  });

  afterEach(() => {
    Definition.desktopDefinition.programs = actualPrograms;
  });

  it('should be created', inject([ProgramService], (service: ProgramService) => {
    expect(service).toBeTruthy();
  }));

  it('#loadCached() should return programs from the definition, with data from localStorage if there is any', inject(
    [ProgramService],
    (service: ProgramService) => {
      const program1 = newTestProgram();
      const program2 = newTestProgram({ id: 'testProgram2' });
      Definition.desktopDefinition.programs = [program1, program2];
      const cachedProgram2 = newTestProgram({ id: program2.id, onDesktop: false, position: new Position(12, 14, 6) });
      const cachedProgram3 = newTestProgram({
        id: 'testProgram3',
        onDesktop: false,
        position: new Position(62, 36, 3),
      });

      fakeLocalStorage[settingKey(cachedProgram2)] = JSON.stringify({
        onDesktop: cachedProgram2.onDesktop,
        position: cachedProgram2.position,
      });
      fakeLocalStorage[settingKey(cachedProgram3)] = JSON.stringify({
        onDesktop: cachedProgram3.onDesktop,
        position: cachedProgram3.position,
      });

      const programs = service.loadCached();
      expect(programs).toEqual([program1, cachedProgram2]);
      expect(localStorage.getItem).toHaveBeenCalledWith(settingKey(program1));
      expect(localStorage.getItem).toHaveBeenCalledWith(settingKey(program2));
      expect(localStorage.getItem).not.toHaveBeenCalledWith(settingKey(cachedProgram3));
    }
  ));

  it('#loadFresh() should load all programs from the definition and save them to the localStorage', inject(
    [ProgramService],
    async (service: ProgramService) => {
      const program1 = newTestProgram({ id: 'testProgram1', position: new Position(1, 6) });
      const program2 = newTestProgram({ id: 'testProgram2', onDesktop: false, position: new Position(6, 2, 1) });
      const program3 = newTestProgram({ id: 'testProgram3', onDesktop: false });
      Definition.desktopDefinition.programs = [program1, program2, program3];
      spyOn(service, 'loadProgram').and.returnValues(
        new Promise((resolve) => resolve(program1)),
        new Promise((resolve) => resolve(program2)),
        new Promise((resolve) => resolve(program3))
      );

      const result = await service.loadFresh();
      expect(service.loadProgram).toHaveBeenCalledWith(program1);
      expect(service.loadProgram).toHaveBeenCalledWith(program2);
      expect(service.loadProgram).toHaveBeenCalledWith(program3);
      expect(fakeLocalStorage[settingKey(program1)]).toEqual(
        JSON.stringify({ onDesktop: program1.onDesktop, position: program1.position })
      );
      expect(fakeLocalStorage[settingKey(program2)]).toEqual(
        JSON.stringify({ onDesktop: program2.onDesktop, position: program2.position })
      );
      expect(fakeLocalStorage[settingKey(program3)]).toEqual(
        JSON.stringify({ onDesktop: program3.onDesktop, position: program3.position })
      );
      expect(result).toEqual([program1, program2, program3]);
    }
  ));

  xit('#loadProgram() should load the program from the passed definition, with data from the user settings if there is any', inject(
    [ProgramService],
    async (service: ProgramService) => {
      const definition = newTestProgram({ onDesktop: false, position: new Position(63, 214, 78) });
      const data = { onDesktop: true, position: new Position(125, 263, 67) };

      settingService.get.and.returnValue(of(JSON.stringify(data)));

      const program = await service.loadProgram(definition);
      expect(settingService.get).toHaveBeenCalledWith(settingKey(definition));
      expect(program).toEqual(newTestProgram(Object.assign(definition, data)));

      settingService.get.and.returnValue(throwError(() => new Error('unknown setting')));

      const program2 = await service.loadProgram(definition);
      expect(settingService.get).toHaveBeenCalledWith(settingKey(definition));
      expect(settingService.get).toHaveBeenCalledTimes(2);
      expect(program2).toEqual(definition);

      const testError = new Error('some unknown error');
      settingService.get.and.returnValue(() => throwError(() => testError));
      spyOn(console, 'warn');

      const program3 = await service.loadProgram(definition);
      expect(program3).toEqual(definition);
      expect(console.warn).toHaveBeenCalledWith(testError);
    }
  ));

  it('#save() should save the program data to the backend user settings and to the localStorage', inject(
    [ProgramService],
    (service: ProgramService) => {
      const data = { onDesktop: false, position: new Position(125, 236, 75) };
      const program = newTestProgram(data);

      service.save(program);
      expect(settingService.set).toHaveBeenCalledWith(settingKey(program), JSON.stringify(data));
      expect(localStorage.setItem).toHaveBeenCalledWith(settingKey(program), JSON.stringify(data));
    }
  ));
});

class TestWindowDelegate extends WindowDelegate {
  title = 'Test Window';
  icon = '';
  type: Type<WindowComponent> | null = null;
}
