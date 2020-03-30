import { inject, TestBed } from '@angular/core/testing';

import { ProgramService } from './program.service';
import * as Definition from '../../assets/desktop/definition';
import { Program } from '../../dataclasses/program';
import { Position } from '../../dataclasses/position';
import { WindowDelegate } from './window/window-delegate';

describe('ProgramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramService]
    });
  });

  it('should be created', inject([ProgramService], (service: ProgramService) => {
    expect(service).toBeTruthy();
  }));

  it('#list() should save the definition to the localstorage and return the programs if the localstorage entry is empty',
    inject([ProgramService], (service: ProgramService) => {
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
      const setItemSpy = spyOn(localStorage, 'setItem');

      const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(0, 0, 0));
      const realDefinition = Object.assign({}, Definition.desktopDefinition);
      Object.assign(Definition.desktopDefinition, { username: 'somebody', programs: [testProgram] });

      const programs = service.list();
      expect(getItemSpy).toHaveBeenCalledWith('desktop');
      expect(setItemSpy).toHaveBeenCalledWith('desktop', btoa(JSON.stringify(Definition.desktopDefinition)));
      expect(programs).toEqual(Definition.desktopDefinition.programs);

      Object.assign(Definition.desktopDefinition, realDefinition);
    }));

  it('#list() should return the programs from the localstorage', inject([ProgramService], (service: ProgramService) => {
    const testProgram = new Program('testProgram', TestWindowDelegate, 'Test Program', '', true, new Position(0, 0, 0));
    const definition = {
      username: 'somebody',
      programs: [testProgram]
    };

    const realPrograms = Definition.desktopDefinition.programs;
    Definition.desktopDefinition.programs = definition.programs;
    Definition.programWindows['testProgram'] = TestWindowDelegate;
    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(btoa(JSON.stringify(definition)));

    const programs = service.list();
    expect(getItemSpy).toHaveBeenCalledWith('desktop');
    expect(programs).toEqual(definition.programs);

    delete Definition.programWindows['testProgram'];
    Definition.desktopDefinition.programs = realPrograms;
  }));

  it('#list() should add the programs from the definition to the existing ones from the localstorage and remove not longer existing ones',
    inject([ProgramService], (service: ProgramService) => {
      const testProgram1 = new Program('testProgram1', TestWindowDelegate, 'Test Program', '', true, new Position(0, 0, 0));
      const testProgram2 = new Program('testProgram2', TestWindowDelegate, 'Test Program', '', true, new Position(0, 0, 0));
      const testProgram2Moved = new Program('testProgram2', TestWindowDelegate, 'Test Program', '', true, new Position(50, 100, 3));
      const testProgram3 = new Program('testProgram3', TestWindowDelegate, 'Test Program', '', true, new Position(0, 0, 0));
      const storedDefinition = {
        username: 'somebody',
        programs: [testProgram1, testProgram2Moved]
      };

      const realPrograms = Definition.desktopDefinition.programs;
      Definition.desktopDefinition.programs = [testProgram2, testProgram3];
      Definition.programWindows['testProgram1'] = TestWindowDelegate;
      Definition.programWindows['testProgram2'] = TestWindowDelegate;
      Definition.programWindows['testProgram3'] = TestWindowDelegate;
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(btoa(JSON.stringify(storedDefinition)));

      const programs = service.list();
      expect(getItemSpy).toHaveBeenCalledWith('desktop');
      expect(programs).toEqual([testProgram2Moved, testProgram3]);

      delete Definition.programWindows['testProgram1'];
      delete Definition.programWindows['testProgram2'];
      delete Definition.programWindows['testProgram3'];
      Definition.desktopDefinition.programs = realPrograms;
    })
  );

  it('#update() should update the localstorage desktop entry with the new program states',
    inject([ProgramService], (service: ProgramService) => {
      const testProgram = new Program('testProgram', TestWindowDelegate, 'Test Program', '', true, new Position(0, 0, 0));
      const before = {
        username: 'somebody',
        programs: []
      };
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(btoa(JSON.stringify(before)));
      const setItemSpy = spyOn(localStorage, 'setItem');
      const oldPrograms = service.programs;
      const newPrograms = [testProgram];
      service.programs = newPrograms;

      service.update();
      expect(getItemSpy).toHaveBeenCalledWith('desktop');
      expect(setItemSpy).toHaveBeenCalledWith('desktop', btoa(JSON.stringify({
        username: before.username,
        programs: newPrograms
      })));

      service.programs = oldPrograms;
    }));

});

class TestWindowDelegate extends WindowDelegate {
  title = 'Test Window';
  icon = '';
  type = null;
}
