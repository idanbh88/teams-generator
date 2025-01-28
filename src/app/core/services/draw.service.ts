import { inject, Injectable } from '@angular/core';
import { Draw } from '../draw';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private readonly http = inject(HttpClient);
  private readonly _draw = new Draw();
  public get draw(): Draw {
    return this._draw;
  }
  constructor() { }

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
