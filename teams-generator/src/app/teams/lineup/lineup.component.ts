import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounce, debounceTime, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Player } from '../../core/models/player.model';
import { PlayerService } from '../../core/services/player.service';
import { Draw } from '../../core/draw';
import {MatButtonModule} from '@angular/material/button';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lineup',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss'
})
export class LineupComponent implements OnInit {

  private playerService = inject(PlayerService);
  control = new FormControl('');
  lineupControl = new FormControl('');
  options: Player[] = [];
  filteredOptions?: Observable<Player[]>;
  draw = input<Draw>();

  ngOnInit() {
    this.playerService.getAll().subscribe(players => {
      this.options = players;
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value =>{ 
          return this.options
          .filter(option => !this.draw()?.players.includes(option))
          .filter(option => option.name.toLowerCase().includes((value ? value : '').toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name));
        }),
      );
    });

  }

  selected(event: any): void {
    this.draw()?.addPlayer(event.option.value);
    event.option.deselect();
    this.control.setValue('');
  }
}
