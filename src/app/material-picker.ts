import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { families, shadeNames } from './material-colors';

@Component({ selector: 'app-material-picker', template: `
  <button #trigger type="button" class="property" aria-haspopup="dialog" [attr.aria-expanded]="pickerDialog.open"
    [attr.aria-label]="label() + ' color: ' + currentName()" (click)="pickerDialog.showModal()">
    <span>{{role()}}</span><i aria-hidden="true" [style.background]="value()"></i>
  </button>
  <dialog #pickerDialog [attr.aria-label]="label() + ' color picker'" (close)="trigger.focus()">
    <h3>{{label()}} color</h3>
    <div role="group" aria-label="Color family" class="swatches">
      @for (family of families; track family.name) {
        <button type="button" class="swatch" [attr.aria-label]="family.name" [attr.aria-pressed]="active() === family" (click)="choose.emit(family.shades[family.shades.length - 1].hex)"><i aria-hidden="true" [style.background]="(family.shades[5] ?? family.shades[0]).hex"></i></button>
      }
    </div>
    <fieldset class="shades"><legend>Shades</legend><div class="swatches">
      @for (shade of active().shades; track shade.hex) {
        <button type="button" class="swatch" [attr.aria-pressed]="value() === shade.hex" [attr.aria-label]="shade.name" (click)="choose.emit(shade.hex)"><i aria-hidden="true" [style.background]="shade.hex"></i></button>
      }
      @if (label() === 'light text') { <button type="button" class="swatch" aria-label="Use default text color" [attr.aria-pressed]="value() === '#222B38'" (click)="choose.emit('#222B38')"><i aria-hidden="true" style="background:#222B38"></i></button> }
    </div></fieldset>
    <div class="actions"><button type="button" (click)="pickerDialog.close()">Done</button></div>
  </dialog>`, styles: `
    :host {display:block} button {cursor:pointer}
    .property {width:100%;display:flex;align-items:center;justify-content:space-between;gap:.5rem;text-transform:capitalize;text-align:start;background:transparent;color:var(--foreground);border:0;padding:.3rem;min-height:28px}
    i {display:inline-block;width:1.2em;height:1.2em;border:1px solid var(--muted);border-radius:.2em;vertical-align:middle}
    .property i {flex:none}
    dialog {position:fixed;margin:auto;width:min(20rem,calc(100vw - 2rem));max-height:calc(100vh - 2rem);overflow:auto;padding:1rem;border:1px solid var(--border-color);border-radius:.5rem;background:var(--background);color:var(--foreground)}
    dialog::backdrop {background:#26304488}
    h3 {margin:0 0 .75rem;font-size:1em;text-transform:capitalize}
    .swatches {display:flex;flex-wrap:wrap;gap:4px;margin:.4rem 0}
    .swatch {width:24px;height:24px;display:inline-grid;place-items:center;padding:0;border:0;background:transparent}
    .shades {min-width:0;margin:.75rem 0;padding:.25rem .5rem;border:1px solid var(--border-color);border-radius:.25rem}
    .shades legend {padding:0 .25rem;font-size:.85em;color:var(--muted)} .shades .swatches {margin:0}
    .swatch[aria-pressed=true] {outline:2px solid var(--foreground);outline-offset:-1px}
    button:focus-visible {outline:2px solid var(--focus-color);outline-offset:2px}
    .actions {display:flex;justify-content:flex-end;margin-top:.75rem}
  ` })
export class MaterialPicker {
  readonly families = families;
  readonly role = input.required<string>(); readonly label = input.required<string>(); readonly value = input.required<string>();
  readonly choose = output<string>();
  readonly active = linkedSignal(() => families.find(f => f.shades.some(s => s.hex === this.value())) ?? families[0]);
  readonly currentName = computed(() => shadeNames.get(this.value()) ?? 'Default text');
}
