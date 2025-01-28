import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
private readonly http = inject(HttpClient);
  constructor() { 
   
  }

  public getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(environment.playersUrl);
  }

  public updateAll(players: Player[]): Observable<Player[]> {
    return this.http.put<Player[]>(environment.playersUrl, players);
  }
}
