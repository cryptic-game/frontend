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
      spyOnProperty(Definition, 'desktopDefinition').and.returnValue({ username: 'somebody', programs: [testProgram] });

      const programs = service.list();
      expect(getItemSpy).toHaveBeenCalledWith('desktop');
      expect(setItemSpy).toHaveBeenCalledWith('desktop', btoa(JSON.stringify(Definition.desktopDefinition)));
      expect(programs).toEqual(Definition.desktopDefinition.programs);
    }));

  it('#list() should return the programs from the localstorage', inject([ProgramService], (service: ProgramService) => {
    const testProgram = new Program('testProgram', TestWindowDelegate, 'Test Program', '', true, new Position(0, 0, 0));
    const definition = {
      username: 'somebody',
      programs: [testProgram]
    };

    spyOnProperty(Definition, 'programWindows').and.returnValue({ testProgram: TestWindowDelegate });
    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(btoa(JSON.stringify(definition)));

    const programs = service.list();
    expect(getItemSpy).toHaveBeenCalledWith('desktop');
    expect(programs).toEqual(definition.programs);
  }));

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
