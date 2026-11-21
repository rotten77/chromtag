import { Component, computed, input, output, linkedSignal } from '@angular/core';
import { families, shadeNames } from './material-colors';

@Component({ selector: 'app-material-picker', template: `
  <div role="group" [attr.aria-label]="label()">
    <div class="role-name">{{role()}}: <i [style.background]="value()" role="img" [attr.aria-label]="currentName()"></i></div>
    <div role="group" aria-label="Color family" class="swatches">
      @for (family of families; track family.name) {
        <button type="button" [attr.aria-label]="family.name" [attr.aria-pressed]="active() === family" [style.background]="(family.shades[5] ?? family.shades[0]).hex" (click)="active.set(family)"></button>
      }
    </div>
    <div role="group" aria-label="Shades" class="swatches">
      @for (shade of active().shades; track shade.hex) {
        <button type="button" [attr.aria-pressed]="value() === shade.hex" [attr.aria-label]="shade.name" [style.background]="shade.hex" (click)="choose.emit(shade.hex)"></button>
      }
    </div>
    @if (label() === 'light text') { <button type="button" aria-label="Use default text color" style="background:#222B38" [attr.aria-pressed]="value() === '#222B38'" (click)="choose.emit('#222B38')"></button> }
  </div>`, styles: `button {cursor:pointer} .role-name {text-transform:capitalize;padding:.3rem} i {display:inline-block;width:1.2em;height:1.2em;border:1px solid currentColor;border-radius:.2em;vertical-align:middle;margin-inline-end:.4em} .swatches {display:flex;flex-wrap:wrap;gap:5px;margin:.5rem 0} button {width:28px;height:28px;padding:0;border:1px solid var(--muted)} button[aria-pressed=true] {box-shadow:inset 0 0 0 2px white,inset 0 0 0 4px black} button:focus-visible {outline:2px solid var(--focus-color);outline-offset:2px}` })
export class MaterialPicker {
  readonly families = families;
  readonly role = input.required<string>(); readonly label = input.required<string>(); readonly value = input.required<string>();
  readonly choose = output<string>();
  readonly active = linkedSignal(() => families.find(f => f.shades.some(s => s.hex === this.value())) ?? families[0]);
  readonly currentName = computed(() => shadeNames.get(this.value()) ?? 'Default text');
}
