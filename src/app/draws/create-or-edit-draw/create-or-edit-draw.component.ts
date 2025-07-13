import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { DrawSettingsComponent } from '../draw-settings/draw-settings.component';
import { LineupComponent } from '../lineup/lineup.component';
import { Draw } from '../../core/models/draw.model';
import { DrawService } from '../../core/services/draw.service';
import { DrawTeamsComponent } from "../draw-teams/draw-teams.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-or-edit-draw',
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LineupComponent,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
    DrawSettingsComponent,
    DrawTeamsComponent
  ],
  templateUrl: './create-or-edit-draw.component.html',
  styleUrl: './create-or-edit-draw.component.scss'
})
export class CreateOrEditDrawComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);
  public sending = signal(false);
  public drawService = inject(DrawService);
  private _formBuilder = inject(FormBuilder);
  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: [''] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: [''] });
  private route = inject(ActivatedRoute);
  public showAnimation = false;
  public draw?: Draw;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const drawId = params.get('id');
      if (drawId) {
        // Load the draw using the drawId
        this.drawService.getDraw(drawId).subscribe(draw => {
          this.draw = draw;
        });
      }
    });
  }

  public saveDraw(): void {
    if (!this.draw) {
      return;
    }
    this.sending.set(true);
    this.drawService.updateDraw(this.draw)
      .subscribe({
        next: (data) => {
          this._snackBar.open('נשמר בהצלחה', 'סגור', {
            duration: 3000
          });
          this.sending.set(false);
        },
        error: (error) => {
          this._snackBar.open('שגיאה בשמירה', 'סגור', {
            duration: 3000
          });
          this.sending.set(false);
        },
      });
  }



  public generateTeams(): void {
    this.showAnimation = true;
    this.drawService.generateDraw(this.draw!);
    setTimeout(() => {
      this.showAnimation = false;
    }, 1000);
  }
}
