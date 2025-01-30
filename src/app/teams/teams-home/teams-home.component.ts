import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { LineupComponent } from "../lineup/lineup.component";
import { Draw } from '../../core/draw';
import { DrawService } from '../../core/services/draw.service';
import { DrawResultComponent } from "../draw-result/draw-result.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DrawComponent } from "../draw/draw.component";

@Component({
  selector: 'app-teams-home',
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LineupComponent,
    DrawResultComponent,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
    DrawComponent
],
  templateUrl: './teams-home.component.html',
  styleUrl: './teams-home.component.scss'
})
export class TeamsHomeComponent {
  private _snackBar = inject(MatSnackBar);
  public sending = signal(false);
  public drawService = inject(DrawService);
  private _formBuilder = inject(FormBuilder);
  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: [''] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: [''] });
  public showAnimation = false;

  public get draw(): Draw {
    return this.drawService.draw;
  }

  public saveDraw(): void {
    this.sending.set(true);
    this.drawService.saveDraw().subscribe({
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
    this.drawService.generateDraw();
    setTimeout(() => {
      this.showAnimation = false;
    }, 1000);
   
  }
}
