import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { MaterialPicker } from './material-picker';
import { shadeNames } from './material-colors';
import { CHROME } from './chrome-api';
import { Theme, ThemeMode, watchTheme } from './appearance';

const ranges = {
  width: { label: 'Popup width', min: 380, max: 800, step: 1, initial: 540, unit: 'px' },
  height: { label: 'Popup height', min: 400, max: 600, step: 1, initial: 580, unit: 'px' },
  font: { label: 'Font size', min: 12, max: 18, step: 1, initial: 13, unit: 'px' },
  split: { label: 'Filter space', min: 20, max: 60, step: 5, initial: 35, unit: '%' },
};
type Dimension = keyof typeof ranges;
const colors = {
  light: { text: '#222B38', tag: '#1976D2', folder: '#388E3C', highlight: '#212121', selection: '#D32F2F' },
  dark: { text: '#FAFAFA', tag: '#90CAF9', folder: '#A5D6A7', highlight: '#424242', selection: '#D32F2F' },
};
type Role = keyof typeof colors.light;
type Palette = Record<Role,string>;
type Appearance = Record<Dimension,number> & Record<Theme,Palette> & {mode: ThemeMode};
const dimensions = Object.keys(ranges) as Dimension[];
const roles: Role[] = ['text','tag','folder','highlight','selection'];
const themes: Theme[] = ['light','dark'];
function record(value: unknown): Record<string,unknown> { return value && typeof value === 'object' ? value as Record<string,unknown> : {}; }
export function appearanceFrom(value: unknown): Appearance {
  const raw = record(value);
  const result: Appearance = { width: 540, height: 580, font: 13, split: 35, mode: 'system', light: {...colors.light}, dark: {...colors.dark} };
  if (raw['mode'] === 'light' || raw['mode'] === 'dark') result.mode = raw['mode'];
  for (const key of dimensions) {
    const n = raw[key], {min,max,step,initial} = ranges[key];
    result[key] = typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, min + Math.round((n-min)/step)*step)) : initial;
  }
  for (const theme of themes) for (const role of roles) {
    const c = record(raw[theme])[role];
    result[theme][role] = typeof c === 'string' && shadeNames.has(c) ? c : colors[theme][role];
  }
  return result;
}

@Component({selector:'app-appearance', imports:[MaterialPicker], template: `
  <fieldset [disabled]="!ready()"><legend>Appearance</legend>
    <div class="size-fields" role="group" aria-label="Popup size"><span>Popup size:</span><div class="size-inputs">
      @for (key of sizeKeys; track key) {
        <input #size type="number" [attr.aria-label]="ranges[key].label" [min]="ranges[key].min" [max]="ranges[key].max" [value]="settings()[key]" (change)="commitSize(key,size)">
        @if (key === 'width') { <span aria-hidden="true">×</span> }
      }
    </div></div>
    @for (key of sliders; track key) {
      <label>{{ranges[key].label}} <input type="range" [attr.aria-label]="ranges[key].label" [min]="ranges[key].min" [max]="ranges[key].max" [step]="ranges[key].step" [value]="settings()[key]" (input)="setDimension(key, +$any($event.target).value)"> {{settings()[key]}}{{ranges[key].unit}}</label>
    }
    <label>Theme <select aria-label="Theme" [value]="settings().mode" (change)="update({mode: $any($event.target).value})"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
    @for (theme of themes; track theme) {
      <details><summary>{{theme === 'light' ? 'Light' : 'Dark'}} colors</summary>
      @for (role of roles; track role) {
        <app-material-picker [role]="role" [label]="theme + ' ' + role" [value]="settings()[theme][role]" (choose)="setColor(theme,role,$event)" />
      }
      <button type="button" class="reset-colors" (click)="resetColors(theme)">Reset {{theme}} colors to defaults</button>
      </details>
    }
  </fieldset>
  @if (error()) { <p role="alert">Appearance settings could not be loaded or saved.</p> }
`, styles:`legend { font-weight:600; padding:0; } summary { cursor:pointer; list-style:none; text-decoration:underline; text-underline-offset:.15em; } summary::-webkit-details-marker { display:none; } fieldset { margin: .4rem 0 0; border:0; padding:0; display:grid; gap:.35rem; } fieldset > * + *, app-material-picker + app-material-picker { border-block-start:1px solid var(--border-color); padding-block-start:.4rem; } app-material-picker {display:block} .reset-colors {margin-block:.5rem} label { justify-content:space-between; } input { min-width:0; width:8rem; } .size-fields { display:flex;align-items:center;justify-content:space-between;gap:.5rem } .size-inputs { display:flex;align-items:center;gap:.4rem } .size-inputs input { width:4.5rem;max-width:100% }`})
export class AppearanceSettings {
  readonly ranges=ranges; readonly colors=colors; readonly roles=roles; readonly themes=themes; readonly sizeKeys=['width','height'] as const; readonly sliders=['font','split'] as const;
  readonly settings=signal(appearanceFrom(null)); readonly ready=signal(false); readonly error=signal(false);
  private readonly area=inject(CHROME).storage?.local;
  constructor() {
    const root=document.documentElement;
    const system=window.matchMedia?.('(prefers-color-scheme: dark)');
    effect(onCleanup => {
      const s=this.settings();
      for (const [key,val] of Object.entries({'--popup-width':s.width+'px','--popup-height':s.height+'px','--base-font-size':s.font+'px','--filter-share':String(s.split/100)})) root.style.setProperty(key,val);
      const apply=(theme:Theme) => {
        root.dataset['theme']=theme;
        root.style.setProperty('--cloud-hover-color',s[theme].highlight); root.style.setProperty('--active-color',s[theme].selection);
        root.style.setProperty('--foreground',s[theme].text); root.style.setProperty('--folder-color',s[theme].folder); root.style.setProperty('--tag-color',s[theme].tag);
      };
      if (system) onCleanup(watchTheme(s.mode,system,apply)); else apply(s.mode==='dark'?'dark':'light');
    });
    const lifecycle=inject(DestroyRef);
    if (this.area) void this.area.get('appearance').then(data=>{ if (!lifecycle.destroyed) {this.settings.set(appearanceFrom(data['appearance'])); this.ready.set(true);} }).catch(()=>this.error.set(true));
  }
  update(patch: Partial<Appearance>): void {
    const s=appearanceFrom({...this.settings(),...patch}); this.settings.set(s);
    void this.area.set({appearance:s}).catch(()=>this.error.set(true));
  }
  commitSize(key:'width'|'height', input:HTMLInputElement): void {
    if (Number.isFinite(input.valueAsNumber)) this.setDimension(key,input.valueAsNumber);
    input.value=String(this.settings()[key]);
  }
  resetColors(theme:Theme): void { this.update({[theme]: {...colors[theme]}}); }
  setDimension(key:Dimension,value:number): void {this.update({[key]:value});}
  setColor(theme:Theme,role:Role,color:string): void {this.update({[theme]:{...this.settings()[theme],[role]:color}});}
}
