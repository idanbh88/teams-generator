import { Team } from "../team";

export interface Draw{
    numberOfRepetitions: number;
    numberOfTeams: number;
    teams: Team[];
    name: string;
    time: Date;
}