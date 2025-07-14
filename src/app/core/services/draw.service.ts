import { inject, Injectable, EventEmitter } from '@angular/core';
import { Draw } from '../models/draw.model';
import { Player } from '../models/player.model';
import { Team } from '../models/team.model';
import { TeamService } from './team.service';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getCountFromServer, getDoc, limit, orderBy, query, startAfter, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, debounceTime, from, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  private readonly teamService = inject(TeamService);
  private readonly _draw = this.drawFactory();
  private readonly firestore: Firestore = inject(Firestore);
  public draws$: Observable<Draw[]>;
  public currentDraws$: Observable<{ items: Draw[], totalCount: number }>;
  private _pageSize = new BehaviorSubject<number>(10);
  private _pageIndex = new BehaviorSubject<number>(0);

  public drawModified: EventEmitter<Draw> = new EventEmitter();

  public set pageSize(value: number) {
    this._pageSize.next(value);
  }

  public get pageSize(): number {
    return this._pageSize.value;
  }

  public set pageIndex(value: number) {
    this._pageIndex.next(value);
  }

  public get pageIndex(): number {
    return this._pageIndex.value;
  }

  private _drawsCount = 0;
  public get drawsCount(): number {
    return this._drawsCount;
  }


  public totalCount$: Observable<number>;
  private lastVisible: any = null;
  private lastPageIndex = 0;
  private drawCache: Draw[] = [];
  private history: Draw[] = [];

  constructor() {
    this.totalCount$ = from(getCountFromServer(query(collection(this.firestore, 'draws'), orderBy('time', 'desc'))))
      .pipe(switchMap(snapshot => [snapshot.data().count]));

    this.draws$ = combineLatest([this._pageSize, this._pageIndex])
      .pipe(
        debounceTime(100),
        switchMap(([pageSize, pageIndex]) => {
          const ref = collection(this.firestore, 'draws');
          let q;
          /* if(this.lastVisible){
             q = query(ref, orderBy('time','desc'), startAfter(this.lastVisible), limit(pageSize));
          } else {
             q = query(ref, orderBy('time','desc'), limit(pageSize));
          } */
          q = query(ref, orderBy('time', 'desc'), limit(50));
          return collectionData(q, { idField: 'id' }) as Observable<Draw[]>;
        }),
        map(draws => {
          return draws.map(draw => {
            draw.time = new Date(((draw as any).time.seconds as number) * 1000);
            return draw;
          });
        }
        )
      );

    this.currentDraws$ = combineLatest([this.draws$, this.totalCount$])
      .pipe(
        tap(([draws, totalCount]) => {
          if (draws.length > 0) {
            this.lastVisible = draws[draws.length - 1]; // Track last document for pagination
          }
        }),
        tap(([draws, totalCount]) => {
          this.drawCache = draws;
          // take fist 5 draws and add them to history
          this.history = [...draws.slice(0, 5), ...this.history];
        }),
        map(([draws, totalCount]) => ({ items: draws, totalCount }))
      );
  }

  public createDraw(): Observable<Draw> {
    const draw = this.drawFactory();
    const ref = collection(this.firestore, 'draws'); // Reference to collection

    return from(addDoc(ref, draw)).pipe(
      map(docRef => {
        const createdDraw = { ...draw, id: docRef.id };
        this.drawModified.emit(createdDraw);
        return createdDraw;
      })
    );
  }

  deleteDraw(id: string): Observable<void> {
    const itemRef = doc(this.firestore, `draws/${id}`); // Reference to document
    return from(deleteDoc(itemRef)); // Convert to Observable
  }

  updateDraw(draw: Draw): Observable<void> {
    const itemRef = doc(this.firestore, `draws/${draw.id}`); // Reference to document
    return from(updateDoc(itemRef, draw as any)).pipe(
      tap(() => this.drawModified.emit(draw))
    ); // Convert to Observable
  }

  getDraw(id: string): Observable<Draw> {
    const cacheItem = this.drawCache.find(d => d.id === id);
    if (cacheItem) {
      return of(cacheItem);
    }

    const itemRef = doc(this.firestore, `draws/${id}`); // Reference to document
    return from(getDoc(itemRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          const draw = { id: snapshot.id, ...snapshot.data() } as Draw; // Get document data
          draw.time = new Date(((draw as any).time.seconds as number) * 1000);
          return draw;
        } else {
          throw new Error('Document not found');
        }
      })
    );
  }

  public drawFactory(): Draw {
    const date = this.getNextGameDate();
    return {
      lineup: [],
      teams: [],
      numberOfTeams: 3,
      numberOfRepetitions: 3,
      playersInTier: 3,
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


  public generateDraw(draw: Draw): void {
    this.generateTeams(draw);
  }

  public addPlayer(draw: Draw, player: Player) {
    draw.lineup!.push(player);
    this.drawModified.emit(draw);
  }

  public removePlayer(draw: Draw, player: Player) {
    draw.lineup = draw.lineup!.filter(p => p.id !== player.id);
  }

  public generateTeams(draw: Draw): void {

    let currentTeams: Team[] = [];
    let bestDifferece = 999999999;
    for (let i = 0; i < draw.numberOfRepetitions; i++) {

      const teams = this.generateTeamsBase(draw);

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
    draw.teams = currentTeams;
  }

  private generateTeamsBaseDeprecated(draw: Draw): Team[] {
    const groupSize = Math.floor(draw.lineup!.length / draw.numberOfTeams);
    const groups: Player[][] = [];

    // Create groups
    for (let i = 0; i < groupSize; i++) {
      groups.push([]);
    }

    const sortedPlayers = draw.lineup!.sort((a, b) => b.skillLevel - a.skillLevel);
    let playerIndex = 0;

    for (let j = 0; j < groupSize; j++) {
      for (let i = 0; i < draw.numberOfTeams; i++) {
        groups[j].push(sortedPlayers[playerIndex++]);
      }
    }

    const teams = [];
    for (let i = 0; i < draw.numberOfTeams; i++) {
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

  private generateTeamsBase(draw: Draw): Team[] {
    // Use numberOfTiers instead of groupSize
    const tierSize = draw.playersInTier || draw.numberOfTeams;;
    const numberOfTiers = draw.lineup!.length / tierSize;
    const sortedPlayers = draw.lineup!.sort((a, b) => b.skillLevel - a.skillLevel);

    // Create tiers
    const tiers: Player[][] = [];
    for (let i = 0; i < numberOfTiers; i++) {
      tiers.push(sortedPlayers.slice(i * tierSize, (i + 1) * tierSize));
    }

    // Create teams
    const teams: Team[] = [];
    for (let i = 0; i < draw.numberOfTeams; i++) {
      teams.push({ name: `קבוצה ${i + 1}`, players: [], skillLevelSum: 0 });
    }

    // Distribute players from tiers to teams (can be randomized or sequential)
    for (const tier of tiers) {
      const shuffledTier = this.shuffleArray(tier);
      let teamIndex = 0;
      for (const player of shuffledTier) {
        this.teamService.addPlayer(teams[teamIndex++ % teams.length], player);
      }
    }

    // sort all players in each team by skill level
    for (const team of teams) {
      team.players.sort((a, b) => b.skillLevel - a.skillLevel);
    }
    return teams;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
