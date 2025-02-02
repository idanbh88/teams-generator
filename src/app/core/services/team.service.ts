import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor() { }

  public addPlayer(team: Team, player: Player) {
    team.players.push(player);
    team.skillLevelSum += player.skillLevel;
    team.skillLevelSum = Math.round(team.skillLevelSum * 100) / 100;
  }

  public reCalculateSkillLevelSum(team: Team) {
    team.skillLevelSum = team.players.reduce((sum, player) => sum + player.skillLevel, 0);
    team.skillLevelSum = Math.round(team.skillLevelSum * 100) / 100;
  }
}
