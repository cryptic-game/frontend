import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DesktopComponent } from './desktop.component';
import { DesktopMenuComponent } from './desktop-menu/desktop-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PXtoViewHeightPipe } from '../pxto-view-height.pipe';
import { PXtoViewWidthPipe } from '../pxto-view-width.pipe';
import { DesktopStartmenuComponent } from './desktop-startmenu/desktop-startmenu.component';
import { FormsModule } from '@angular/forms';
import { WindowManagerComponent } from './window-manager/window-manager.component';
import { WindowFrameComponent } from './window/window-frame.component';
import { WebsocketService } from '../websocket.service';
import { ProgramService } from './program.service';
import { of, Subject } from 'rxjs';
import { Program } from '../../dataclasses/program';
import { Position } from '../../dataclasses/position';
import { By } from '@angular/platform-browser';
import { WindowManagerService } from './window-manager/window-manager.service';
import { WindowDelegate } from './window/window-delegate';
import { emptyDevice, FakePromise, webSocketMock, windowManagerMock } from '../test-utils';
import { DeviceService } from '../api/devices/device.service';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { VersionService } from '../version.service';

describe('DesktopComponent', () => {
  const testDevice = { ...emptyDevice({ uuid: 'b8a67b5c-7aaa-4acb-805d-3d86af7a6fb7' }) };
  let component: DesktopComponent;
  let fixture: ComponentFixture<DesktopComponent>;
  let activatedRouteDataSubject;
  let windowManagerService;
  let windowManager;
  let versionService;
  let programService;

  beforeEach(waitForAsync(() => {
    const deviceService = jasmine.createSpyObj('DeviceService', ['getDevices']);
    deviceService.getDevices.and.returnValue(of({ 'devices': [testDevice] }));
    activatedRouteDataSubject = new Subject<any>();

    windowManager = windowManagerMock();
    windowManagerService = jasmine.createSpyObj('WindowManagerService', ['forDevice']);
    windowManagerService.forDevice.and.returnValue(windowManager);

    versionService = jasmine.createSpyObj('VersionService', ['cancelUpdate', 'updateAndReload', 'updateRead']);
    versionService.CURRENT_VERSION = '';
    versionService.availableUpdate = null;
    versionService.previousVersion = null;
    versionService.justUpdated = false;

    programService = jasmine.createSpyObj('ProgramService', ['loadCached', 'loadFresh', 'loadProgram', 'save']);
    programService.loadCached.and.returnValue([]);
    programService.loadFresh.and.returnValue(new FakePromise());
    programService.save.and.returnValue(new FakePromise());

    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocketMock() },
        { provide: DeviceService, useValue: deviceService },
        { provide: ActivatedRoute, useValue: { data: activatedRouteDataSubject } },
        { provide: WindowManagerService, useValue: windowManagerService },
        { provide: RouteReuseStrategy, useValue: {} },
        { provide: VersionService, useValue: versionService },
        { provide: ProgramService, useValue: programService }
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        DesktopComponent,
        DesktopMenuComponent,
        PXtoViewWidthPipe,
        PXtoViewHeightPipe,
        DesktopStartmenuComponent,
        WindowManagerComponent,
        WindowFrameComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopComponent);
    component = fixture.componentInstance;
    activatedRouteDataSubject.next({ 'device': testDevice });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the window manager for the active device', () => {
    expect(component.windowManager).toEqual(windowManager);
    expect(windowManagerService.forDevice).toHaveBeenCalledWith(testDevice);
  });

  it('#ngOnInit() should load the program linkages', () => {
    const cachedPrograms = [new Program('test-program-1', null, '', '', false, new Position(73, 15, 25))];
    const freshPrograms = [new Program('test-program-2', null, '', '', true, new Position(85, 74, 63))];
    const freshProgramsPromise = new FakePromise();
    programService.loadCached.and.returnValue(cachedPrograms);
    programService.loadFresh.and.returnValue(freshProgramsPromise);
    component.ngOnInit();
    expect(component.linkages).toEqual(cachedPrograms);
    freshProgramsPromise.resolve(freshPrograms);
    expect(component.linkages).toEqual(freshPrograms);
  });

  it('#onDesktop() should return all desktop shortcuts which have the onDesktop property set to true', () => {
    component.linkages = [
      new Program('testProgram1', null, 'Test Program', '', true, new Position(0, 0, 0)),
      new Program('testProgram2', null, 'Test Program', '', false, new Position(0, 0, 0)),
      new Program('testProgram3', null, 'Test Program', '', true, new Position(0, 0, 0)),
      new Program('testProgram4', null, 'Test Program', '', true, new Position(0, 0, 0)),
      new Program('testProgram5', null, 'Test Program', '', false, new Position(0, 0, 0)),
    ];
    expect(component.onDesktop()).toEqual(component.linkages.filter(linkage => linkage.onDesktop));
  });

  it('#toggleStartMenu() should turn the start menu on if it was turned off', () => {
    component.startMenu = false;
    component.toggleStartMenu();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-desktop-startmenu'))).toBeTruthy();
  });

  it('#toggleStartMenu() should turn the start menu off if it was turned on', () => {
    component.startMenu = true;
    component.toggleStartMenu();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-desktop-startmenu'))).toBeFalsy();
  });

  it('#hideStartMenu() should turn the start menu off', () => {
    component.startMenu = false;
    component.hideStartMenu();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-desktop-startmenu'))).toBeFalsy();
    component.startMenu = true;
    component.hideStartMenu();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-desktop-startmenu'))).toBeFalsy();
  });

  it('should call #hideStartMenu() when you put your mouse down on the empty desktop surface', () => {
    const hideSpy = spyOn(component, 'hideStartMenu');
    component.surface.nativeElement.dispatchEvent(new Event('mousedown'));
    expect(hideSpy).toHaveBeenCalled();
  });

  it('#openProgramWindow() should open a window using the window manager', () => {
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(0, 0, 0));
    const testDelegate = new class extends WindowDelegate {
      icon = '';
      title = 'This is a test window';
      type = null;
    };
    const newWindowSpy = spyOn(testProgram, 'newWindow').and.returnValue(testDelegate);

    component.openProgramWindow(testProgram);
    expect(newWindowSpy).toHaveBeenCalled();
    expect(windowManager.openWindow).toHaveBeenCalledWith(testDelegate);
  });

  it('should call unfocus() from the window manager when you put your mouse down on the empty desktop surface', () => {
    component.surface.nativeElement.dispatchEvent(new Event('mousedown'));
    expect(windowManager.unfocus).toHaveBeenCalled();
  });

  it('#checkWindowUnfocus() should not call unfocus() from the window manager ' +
    'when you put your mouse down on anything else but the desktop surface', () => {
    component.checkWindowUnfocus(new MouseEvent('mousedown'));
    expect(windowManager.unfocus).not.toHaveBeenCalled();
  });

  it('should display programs from #onDesktop() as shortcuts', () => {
    const testPrograms = [
      new Program('testProgram', null, 'Test Program', '', true, new Position(0, 0, 0)),
      new Program('testProgram2', null, 'Test Program 2', '', true, new Position(0, 100, 0))
    ];
    const onDesktopSpy = spyOn(component, 'onDesktop').and.returnValue(testPrograms);
    fixture.detectChanges();
    expect(onDesktopSpy).toHaveBeenCalled();
    const linkageElements = fixture.debugElement.queryAll(By.css('.linkage'));
    expect(linkageElements.length).toEqual(2);
    // not perfect
  });

  it('should move the position of a shortcut, when drag-and-dropping it, to the drop position', () => {
    setAllowShortcutDropping(true);
    pretendSurfaceSize();
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(0, 0, 0));
    component.linkages = [testProgram];
    fixture.detectChanges();
    const linkageElement: HTMLElement = fixture.debugElement.query(By.css('.linkage')).nativeElement;
    const testDropPos = { x: 54, y: 11 };
    simulateShortcutDrag(linkageElement, testDropPos);

    expect({ x: testProgram.position.x, y: testProgram.position.y })
      .toEqual(testDropPos, 'Shortcut was not dropped at the right position');
    expect(programService.save).toHaveBeenCalledWith(testProgram);
  });

  it('#checkDropAllowed() should only allow dragging a shortcut ' +
    'if the element under the dragging element is the desktop surface or the original linkage', () => {
    const elementsFromPointSpy = spyOn(document, 'elementsFromPoint');
    const movePosition = { x: 246, y: 315 };
    component.dragLinkageIndex = 0;
    const originalLinkageElement = document.createElement('div');
    const anotherLinkageElement = document.createElement('div');
    spyOn(component.surface.nativeElement, 'querySelectorAll').and.returnValue([originalLinkageElement]);

    elementsFromPointSpy.and.returnValue([null, component.surface.nativeElement]);
    expect(component.checkDropAllowed(new MouseEvent('mousemove', { clientX: movePosition.x, clientY: movePosition.y }))).toBeTruthy();
    expect(elementsFromPointSpy).toHaveBeenCalledWith(movePosition.x, movePosition.y);

    elementsFromPointSpy.and.returnValue([null, originalLinkageElement]);
    expect(component.checkDropAllowed(new MouseEvent('mousemove', { clientX: movePosition.x, clientY: movePosition.y }))).toBeTruthy();
    expect(elementsFromPointSpy).toHaveBeenCalledWith(movePosition.x, movePosition.y);

    elementsFromPointSpy.and.returnValue([null, anotherLinkageElement]);
    expect(component.checkDropAllowed(new MouseEvent('mousemove', { clientX: movePosition.x, clientY: movePosition.y }))).toBeFalsy();
    expect(elementsFromPointSpy).toHaveBeenCalledWith(movePosition.x, movePosition.y);

    elementsFromPointSpy.and.returnValue([null]);
    expect(component.checkDropAllowed(new MouseEvent('mousemove', { clientX: movePosition.x, clientY: movePosition.y }))).toBeFalsy();
  });

  it('should not move a shortcut outside the bounds of the desktop surface area', () => {
    setAllowShortcutDropping(true);
    const surfaceSize = { width: 200, height: 600 };
    pretendSurfaceSize(surfaceSize.width, surfaceSize.height);
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(0, 0, 0));
    component.linkages = [testProgram];
    fixture.detectChanges();
    const linkageElement: HTMLElement = fixture.debugElement.query(By.css('.linkage')).nativeElement;
    const testDropPos = { x: 451, y: -15 };
    simulateShortcutDrag(linkageElement, testDropPos);

    expect({ x: testProgram.position.x, y: testProgram.position.y })
      .toEqual({ x: surfaceSize.width - linkageElement.clientWidth, y: 0 }, 'Shortcut was not dropped at the right position');
  });

  it('should move a clone of the linkage along the mouse cursor when dragging', () => {
    pretendSurfaceSize();
    const startPosition = { x: 12, y: 25 };
    const endPosition = { x: 150, y: 64 };
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(startPosition.x, startPosition.y, 0));
    component.linkages = [testProgram];
    fixture.detectChanges();
    const linkageElement: HTMLElement = fixture.debugElement.query(By.css('.linkage')).nativeElement;
    simulateShortcutDrag(linkageElement, endPosition, false);
    fixture.detectChanges();

    const linkageClone = component.dragElement;
    expect(linkageClone).toBeTruthy();
    expect({ x: linkageClone.offsetLeft, y: linkageClone.offsetTop }).toEqual(endPosition);
  });

  it('should not drop a shortcut if checkDropAllowed() returns false', () => {
    setAllowShortcutDropping(false);
    pretendSurfaceSize();
    const startPosition = { x: 78, y: 134 };
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(startPosition.x, startPosition.y, 0));
    component.linkages = [testProgram];
    fixture.detectChanges();
    const linkageElement: HTMLElement = fixture.debugElement.query(By.css('.linkage')).nativeElement;

    simulateShortcutDrag(linkageElement, { x: 256, y: 37 });

    expect({ x: testProgram.position.x, y: testProgram.position.y }).toEqual(startPosition);
  });

  it('should add the class "not-allowed" to the linkage clone when checkDropAllowed() returns false', () => {
    setAllowShortcutDropping(false);
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(0, 0, 0));
    component.linkages = [testProgram];
    fixture.detectChanges();
    const linkageElement: HTMLElement = fixture.debugElement.query(By.css('.linkage')).nativeElement;
    simulateShortcutDrag(linkageElement, { x: 15, y: 26 }, false);
    fixture.detectChanges();

    const linkageClone = component.dragElement;
    expect(linkageClone).toHaveClass('not-allowed');
  });

  it('should also release the dragged shortcut if it was not moved', () => {
    pretendSurfaceSize();
    const startPosition = { x: 25, y: 67 };
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(startPosition.x, startPosition.y, 0));
    component.linkages = [testProgram];
    fixture.detectChanges();
    const linkageElement: HTMLElement = fixture.debugElement.query(By.css('.linkage')).nativeElement;

    linkageElement.dispatchEvent(new MouseEvent('mousedown'));
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect({ x: testProgram.position.x, y: testProgram.position.y }).toEqual(startPosition);
    expect(component.dragLinkageIndex).toBeUndefined();
    expect(component.dragElement).toBeUndefined();
    expect(component.dragOffset).toBeUndefined();
  });

  it('should not do anything with a shortcut if you just move your mouse', () => {
    setAllowShortcutDropping(true);
    pretendSurfaceSize();
    const startPosition = { x: 21, y: 258 };
    const testProgram = new Program('testProgram', null, 'Test Program', '', true, new Position(startPosition.x, startPosition.y, 0));
    component.linkages = [testProgram];

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 124, clientY: 56 }));
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 124, clientY: 56 }));
    expect({ x: testProgram.position.x, y: testProgram.position.y }).toEqual(startPosition);
  });

  it('#checkDropAllowed should use "msElementsFromPoint" if "elementsFromPoint" does not exist on document', () => {
    const elementsFromPoint = document.elementsFromPoint;
    const spy = document['msElementsFromPoint'] = jasmine.createSpy('msElementsFromPoint', document['msElementsFromPoint']);
    document.elementsFromPoint = undefined;
    component.checkDropAllowed(new MouseEvent('mousemove'));

    expect(spy).toHaveBeenCalled();

    document.elementsFromPoint = elementsFromPoint;
  });

  it('#checkDropAllowed should return true if neither "elementsFromPoint" nor "msElementsFromPoint" exists', () => {
    const elementsFromPoint = document.elementsFromPoint;
    const msElementsFromPoint = document['msElementsFromPoint'];
    document.elementsFromPoint = undefined;
    document['msElementsFromPoint'] = undefined;

    expect(component.checkDropAllowed(new MouseEvent('mousemove'))).toBeTruthy();

    document.elementsFromPoint = elementsFromPoint;
    document['msElementsFromPoint'] = msElementsFromPoint;
  });

  function setAllowShortcutDropping(allow: boolean): jasmine.Spy {
    return spyOn(component, 'checkDropAllowed').and.returnValue(allow);
  }

  function pretendSurfaceSize(width = 600, height = 400): jasmine.Spy {
    return spyOn(component.surface.nativeElement, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, width, height));
  }

});


function simulateShortcutDrag(linkageElement: HTMLElement, dropPos: { x: number; y: number }, release = true) {
  const linkageBounds = linkageElement.getBoundingClientRect();
  linkageElement.dispatchEvent(new MouseEvent('mousedown', { clientX: linkageBounds.left, clientY: linkageBounds.top }));
  document.dispatchEvent(new MouseEvent('mousemove', { clientX: linkageBounds.left, clientY: linkageBounds.top }));
  document.dispatchEvent(new MouseEvent('mousemove', { clientX: dropPos.x, clientY: dropPos.y }));
  if (release) {
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: dropPos.x, clientY: dropPos.y }));
  }
}
