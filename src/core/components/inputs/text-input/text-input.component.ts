import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ɵgetDOM as getDOM} from '@angular/common';

export type Flavor = 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}

@Component({
  selector: 'design-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextInputComponent
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor {

  public disabled = false;
  @Input() placeholder: string = "";
  @Input() hintText: string = "";
  @Input() label: string = "";
  @Input() hintColored: boolean = false;
  @Input() public flavor: Flavor = 'primary';
  @ViewChild(HTMLInputElement) private input?: HTMLInputElement;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onEnter = new EventEmitter<InputEvent>();
  onChanged: ((_: any) => void) | null = null;
  onTouched: (() => void) | null = null;
  composing: boolean = false;

  private readonly compositionMode: boolean | null;

  constructor() {
    if (this.compositionMode === null) {
      this.compositionMode = !isAndroid();
    }
  }

  writeValue(obj: any): void {
    if(this.input) {
      this.input.value = obj
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  getLabelColor() {
    if (this.hintColored && !this.disabled && this.flavor != "primary") {
      return this.flavor;
    } else {
      return "";
    }
  }

  onInput(target: EventTarget | null) {
    if (!this.compositionMode || (this.compositionMode && !this.composing)) {
      // @ts-ignore
      this.onChanged?.(target.value)
    }
  }

  compositionStart() {
    this.composing = true;
  }

  compositionEnd(target: EventTarget | null) {
    this.composing = false;
    if (this.compositionMode) {
      // @ts-ignore
      this.onChanged?.(target.value);
    }
  }
}
