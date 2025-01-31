import {Component, input} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Draw } from '../../core/draw';
import { Player } from '../../core/models/player.model';

@Component({
  selector: 'app-draw',
  imports: [CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.scss'
})
export class DrawComponent {
   public draw = input<Draw>();
   public displaySkillLevel = input<boolean>(true);
   
  drop(event: CdkDragDrop<Player[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.draw()?.teams.forEach((team) => {
        team.update();
      });
    }
  }
}
