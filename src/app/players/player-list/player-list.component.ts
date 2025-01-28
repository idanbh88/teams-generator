import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/player.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-player-list',
  imports: [FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent implements AfterViewInit {
  private readonly playerService = inject(PlayerService);
  private _snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'skillLevel', 'actions'];
  dataSource?: MatTableDataSource<Player>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  public sending = signal(false);
  public editPlayer?: Player;
  constructor() {
    this.playerService.getAll().subscribe(players => {
      this.dataSource = new MatTableDataSource(players);
      this.dataSource!.paginator = this.paginator!;
      this.dataSource!.sort = this.sort!;
    });
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    if (!this.dataSource) {
      return;
    }
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public delete(player: Player) {
    if (this.dataSource) {
      this.dataSource.data.splice(this.dataSource.data.indexOf(player), 1);
      this.dataSource.connect().next(this.dataSource.data);
    }
  }

  public addPlayer() {
    if (!this.dataSource) {
      return;
    }
    const player: Player = {
      name: '',
      skillLevel: 0
    }
    this.dataSource.data = [player, ...this.dataSource.data];
    this.dataSource.connect().next(this.dataSource.data);
    this.editPlayer = player;
  }

  private generateUID(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }

  public saveChanges() {
    if (!this.dataSource) {
      return;
    }
    for (let player of this.dataSource.data) {
        if(!player.id)
          player.id = this.generateUID();
        
    }
    this.sending.set(true);
    this.playerService.updateAll(this.dataSource.data)
      .subscribe({
        next: (data) => {
          this.dataSource!.connect().next(data);
          this._snackBar.open('נשמר בהצלחה', 'סגור',{
            duration: 3000
          });
          this.sending.set(false);
        },
        error: (error) => {
          this._snackBar.open('שגיאה בשמירה', 'סגור',{
            duration: 3000
          });
          this.sending.set(false);
        },
      });
  }
}
