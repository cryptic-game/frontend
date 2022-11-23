# Cryptic Components


Style classes :
- primary
- success
- warning
- danger
- info

---

## Button

### Example

```html
 <app-styled-button (click)="login()" flavor="primary" [disabled]="!form.valid">Log in</app-styled-button>
 ```

---

## Radio Button

### Example

```html
<design-radiobutton
  label="Disabled Checked"
  [disabled]="true"
  [checked]="true"
  [id]="'disabled_checked_radiobutton'"
  [name]="'radiobutton'">
</design-radiobutton>
```

---

## Checkbox

### Example

```html
<design-checkbox
  label="Disabled Checked"
  [disabled]="true"
  [checked]="true"
  [id]="'disabled_checked_checkbox'"
  [name]="'disabled_checked_checkbox'">
</design-checkbox>
```

---

## Switches

### Example

```html
<design-switch
  label="Disabled Checked"
  [disabled]="true"
  [(checked)]="buttonStates.disabled_checked_switch"
  [id]="'disabled_checked_switch'"
  [name]="'disabled_checked_switch'">
</design-switch>
```

---