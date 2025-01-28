import { Player } from "./models/player.model";

export class Team{
    public name: string = '';
    private players: Player[] = [];
    private skillLevelSum: number = 0;

    constructor(name: string){
        this.name = name;
    }

    public addPlayer(player: Player){
        this.players.push(player);
        this.skillLevelSum += player.skillLevel;
        // round to 2 decimal places
        this.skillLevelSum = Math.round(this.skillLevelSum * 100) / 100;
    }

    public getSkillLevelSum(){
        return this.skillLevelSum;
    }

    public getPlayers(){
        return this.players;
    }
}