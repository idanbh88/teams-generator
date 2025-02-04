import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, tap } from 'rxjs';
import { addDoc, collection, collectionData, CollectionReference, DocumentReference, Firestore, FirestoreInstances, FirestoreModule } from '@angular/fire/firestore';
import { Draw } from '../models/draw.model';
import { Player } from '../models/player.model';
import { Team } from '../models/team.model';
import { TeamService } from './team.service';


@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private readonly http = inject(HttpClient);
  private readonly teamService = inject(TeamService);
  private readonly _draw = this.drawFactory();
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

  private drawFactory(): Draw {
    const date = this.getNextGameDate();
    return {
      lineup: [],
      teams: [],
      numberOfTeams: 3,
      numberOfRepetitions: 3,
      name: date.toLocaleDateString(),
      time: date
    }
  }


  private getNextGameDate(): Date {
    const date = new Date();
    const day = date.getDay();
    if (day >= 2 && day <= 5) {
      const nextFriday = new Date();
      nextFriday.setDate(date.getDate() + (5 - day));
      nextFriday.setHours(16, 0, 0, 0);
      return nextFriday;
    } else {
      const nextMonday = new Date();
      nextMonday.setDate(date.getDate() + (1 - day));
      nextMonday.setHours(20, 0, 0, 0);
      return nextMonday;
    }
  }


  public generateDraw(): void {
    this.generateTeams();
    this._drawChange.next(this._draw);
  }

  saveDraw(): Observable<any> {
    const drawCollection = collection(this.firestore, 'draws');
    return from(addDoc(drawCollection, this.draw))
      .pipe(
        tap((res) => console.log(res))
      );
  }

  public addPlayer(player: Player) {
    this.draw.lineup.push(player);
  }

  public removePlayer(player: Player) {
    this.draw.lineup = this.draw.lineup.filter(p => p.id !== player.id);
  }

  public generateTeams(): void {

    let currentTeams: Team[] = [];
    let bestDifferece = 999999999;
    for (let i = 0; i < this.draw.numberOfRepetitions; i++) {

      const teams = this.generateTeamsBase();

      // Check if the new teams are better than the previous ones, by caclculating the difference between the best and the worst team
      let bestTeam = teams[0];
      let worstTeam = teams[0];
      for (const team of teams) {
        if (team.skillLevelSum > bestTeam.skillLevelSum) {
          bestTeam = team;
        }
        if (team.skillLevelSum < worstTeam.skillLevelSum) {
          worstTeam = team;
        }
      }
      const differece = bestTeam.skillLevelSum - worstTeam.skillLevelSum;
      if (differece < bestDifferece) {
        currentTeams = teams;
        bestDifferece = differece;
      }
    }
    this.draw.teams = currentTeams;
  }

  private generateTeamsBase(): Team[] {
    const groupSize = Math.floor(this.draw.lineup.length / this.draw.numberOfTeams);
    const groups: Player[][] = [];

    // Create groups
    for (let i = 0; i < groupSize; i++) {
      groups.push([]);
    }

    const sortedPlayers = this.draw.lineup.sort((a, b) => b.skillLevel - a.skillLevel);
    let playerIndex = 0;

    for (let j = 0; j < groupSize; j++) {
      for (let i = 0; i < this.draw.numberOfTeams; i++) {
        groups[j].push(sortedPlayers[playerIndex++]);
      }
    }

    const teams = [];
    for (let i = 0; i < this.draw.numberOfTeams; i++) {
      const team: Team = {
        name: `קבוצה ${i + 1}`,
        players: [],
        skillLevelSum: 0,
      };
      teams.push(team);
    }

    for (const group of groups) {
      const shuffledGroup = group.sort(() => Math.random() - 0.5);
      let teamIndex = 0;
      for (const player of shuffledGroup) {
        this.teamService.addPlayer(teams[teamIndex++], player);
      }
    }

    return teams;
  }
}
