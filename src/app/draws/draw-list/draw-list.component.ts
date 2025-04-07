import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DrawService } from '../../core/services/draw.service';
import { Player } from '../../core/models/player.model';
import { Draw } from '../../core/models/draw.model';
import { Router, RouterLink } from '@angular/router';
import { local_date_intl } from '../../core/date-settings';
import { MatDialog } from '@angular/material/dialog';
import { ActionValidatorComponent } from '../../core/components/action-validator/action-validator.component';

@Component({
  selector: 'app-draw-list',
  imports: [
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    RouterLink,
    MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './draw-list.component.html',
  styleUrl: './draw-list.component.scss'
})
export class DrawListComponent implements AfterViewInit {
  private readonly drawService = inject(DrawService);
  private readonly router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  intl = local_date_intl;
  displayedColumns: string[] = ['time', 'actions'];
  data: Draw[] = [];  
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  public sending = signal(false);
  public deleting = signal(false);

  constructor() {
   
  }
  ngAfterViewInit(): void {
/*     this.paginator?.page.subscribe((e) => {
      
      this.drawService.pageIndex = this.paginator?.pageIndex || 0;
      this.drawService.pageSize = this.paginator?.pageSize || 10;
    });
 */
    
    this.drawService.currentDraws$.subscribe((data) => {
      this.data = data.items;
      this.resultsLength =data.items.length; //data.totalCount;
    });

    this.drawService.pageIndex = this.paginator?.pageIndex || 0;
    this.drawService.pageSize = this.paginator?.pageSize || 10;
  }

  addDraw() {
    this.sending.set(true);
     this.drawService.createDraw().subscribe({
      next: (data) => {
        this.router.navigate(['/draws/edit', data.id]);
        this.sending.set(false);
      },
      error: (error) => {
        this._snackBar.open('שגיאה בשמירה', 'סגור', {
          duration: 3000
        });
        this.sending.set(false);
      }
    });
  }

  deleteDraw(draw: Draw) {
    if (!draw.id) {
      return;
    }

    const dialogRef = this.dialog.open(ActionValidatorComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.deleteDrawAfterConfirmation(draw);
      }
    });

    
  }

  private deleteDrawAfterConfirmation(draw: Draw) {
    this.deleting.set(true);
    return this.drawService.deleteDraw(draw.id!)
    .subscribe({
      next: (data) => {
        this._snackBar.open('נמחק בהצלחה', 'סגור', {
          duration: 3000
        });
        this.deleting.set(false);
        this.drawService.pageIndex = 0;
      },
      error: (error) => {
        this._snackBar.open('שגיאה במחיקה', 'סגור', {
          duration: 3000
        });
        this.deleting.set(false);
      }
    });;
  }

}
