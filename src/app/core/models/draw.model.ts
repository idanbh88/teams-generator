import { Player } from "./player.model";
import { Team } from "./team.model";

export interface Draw{
    id?: string;
    numberOfRepetitions: number;
    numberOfTeams: number;
    teams: Team[];
    lineup?: Player[];
    name?: string;
    time?: Date;
}