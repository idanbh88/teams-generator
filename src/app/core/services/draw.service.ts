import { inject, Injectable } from '@angular/core';
import { Draw } from '../draw';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { addDoc, collection, collectionData, CollectionReference, DocumentReference, Firestore, FirestoreInstances, FirestoreModule } from '@angular/fire/firestore';

export interface DrawItem {
  draw: Draw;
}
@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private readonly http = inject(HttpClient);
  private readonly _draw = new Draw();
  private _drawChange = new BehaviorSubject<Draw>(this._draw);
  firestore = inject(Firestore);
  public get draw(): Draw {
    return this._draw;
  }

  public get drawChange(): Observable<Draw> {
    return this._drawChange.asObservable();
  }

  constructor() {
   
  }

  public generateDraw(): void {
    this.draw.generateTeams();
    this._drawChange.next(this._draw);
  }

  saveDraw(): Observable<any> {
    const drawCollection = collection(this.firestore, 'draws');
    const drawData = this.draw.toPlainObject();
    return from(addDoc(drawCollection, drawData))
      .pipe(
        tap((res) => console.log(res))
      );
  }

  transformToFirestoreFormat(draw: Draw): any {
    return {
      fields: {
        CreationTime: { timestampValue: new Date().toISOString() },
        Teams: {
          arrayValue: {
            values: draw.teams.map(team => ({
              mapValue: {
                fields: {
                  Name: { stringValue: team.name },
                  Players: {
                    arrayValue: {
                      values: team.getPlayers().map(player => ({
                        mapValue: {
                          fields: {
                            Id: { stringValue: player.id },
                            Name: { stringValue: player.name },
                            SkillLevel: { doubleValue: player.skillLevel },
                          },
                        },
                      })),
                    },
                  },
                },
              },
            })),
          },
        },
      },
    };
  }
}
