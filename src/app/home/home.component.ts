import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DrawItem } from '../core/services/draw.service';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    MatRippleModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private firestore = inject(Firestore);
  drawsCollection = collection(this.firestore, 'draws');
  draws$ = collectionData(this.drawsCollection) as Observable<any[]>;

  constructor() {
    this.draws$.subscribe(console.log);
  }
}
