import { inject, Injectable } from '@angular/core';
import { Draw } from '../draw';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private readonly http = inject(HttpClient);
  private readonly _draw = new Draw();
  private _drawChange = new BehaviorSubject<Draw>(this._draw);
  
  public get draw(): Draw {
    return this._draw;
  }
  
  public get drawChange(): Observable<Draw> {
    return this._drawChange.asObservable();
  }
  
  constructor() { }

  public generateDraw(): void {
    this.draw.generateTeams();
    this._drawChange.next(this._draw);
  }

  saveDraw(): Observable<any> {
    const body = this.transformToFirestoreFormat(this.draw);
    return this.http.post(environment.drawUrl, body);
  }

   transformToFirestoreFormat(draw: Draw): any {
    return {
      fields: {
        CreationTime: { timestampValue:  new Date().toISOString() },
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
