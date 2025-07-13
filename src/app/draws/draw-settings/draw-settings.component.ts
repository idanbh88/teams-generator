import { Component, Input, input } from '@angular/core';
import { Draw } from '../../core/models/draw.model';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-draw-settings',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    MatOption,
    MatSelectModule
],
  templateUrl: './draw-settings.component.html',
  styleUrl: './draw-settings.component.scss'
})
export class DrawSettingsComponent {
  private _draw?: Draw;

  @Input()
  set draw(value: Draw | undefined) {
    if (value && (value.playersInTier == null || value.playersInTier === undefined)) {
      value.playersInTier = value.numberOfTeams;
    }
    this.tierSizeOptions = [];
    if (value && value.lineup) {
      let n = value.numberOfTeams;
      while (n <= value.lineup.length / 2 ) {
        this.tierSizeOptions.push(n);
        n *= 2;
      }
    }
    this._draw = value;
  }

  get draw(): Draw | undefined {
    return this._draw;
  }

  public tierSizeOptions: number[] = [];
}
