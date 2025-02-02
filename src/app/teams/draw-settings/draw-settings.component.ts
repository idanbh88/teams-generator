import { Component, input } from '@angular/core';
import { Draw } from '../../core/models/draw.model';
import {FormsModule} from '@angular/forms';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-draw-settings',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
  ],
  templateUrl: './draw-settings.component.html',
  styleUrl: './draw-settings.component.scss'
})
export class DrawSettingsComponent {
  public draw = input<Draw>();
}
