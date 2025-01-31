import { AfterViewInit, Component, input } from '@angular/core';
import { Draw } from '../../core/draw';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-draw-result',
  imports: [
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './draw-result.component.html',
  styleUrl: './draw-result.component.scss'
})
export class DrawResultComponent implements AfterViewInit{

  public draw = input<Draw>();
  public displaySkillLevel = input<boolean>(true);

  public  get displayedColumns(): string[] {
    if(!this.draw() || !this.draw()?.teams ) {
      return [];
    }

    return this.draw()!.teams.map((team) => team.name);
  }

  ngAfterViewInit(): void {
   
  }


}
