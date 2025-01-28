import { Player } from "./models/player.model";
import { Team } from "./team";

export class Draw {
    public numberOfRepetitions: number = 3;
    public numberOfTeams: number = 3;
    public players: Player[] = [];
    public teams: Team[] = [];
    public dataSource: { [key: string]: Player }[] = [];
    public teamsMap: { [key: string]: Team }[] = [];
    constructor() {

    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(player: Player) {
        this.players = this.players.filter(p => p.id !== player.id);
    }

    public generateTeams(): void {

        let currentTeams: Team[] = [];
        let bestDifferece = 999999999;
        for (let i = 0; i < this.numberOfRepetitions; i++) {

            const teams = this.generateTeamsBase();

            // Check if the new teams are better than the previous ones, by caclculating the difference between the best and the worst team
            let bestTeam = teams[0];
            let worstTeam = teams[0];
            for (const team of teams) {
                if (team.getSkillLevelSum() > bestTeam.getSkillLevelSum()) {
                    bestTeam = team;
                }
                if (team.getSkillLevelSum() < worstTeam.getSkillLevelSum()) {
                    worstTeam = team;
                }
            }
            const differece = bestTeam.getSkillLevelSum() - worstTeam.getSkillLevelSum();
            if (differece < bestDifferece) {
                currentTeams = teams;
                bestDifferece = differece;
            }
        }
        this.teams = currentTeams;

        this.buildDataSource();
    }

    private generateTeamsBase(): Team[] {
        const groupSize = Math.floor(this.players.length / this.numberOfTeams);
        const groups: Player[][] = [];

        // Create groups
        for (let i = 0; i < groupSize; i++) {
            groups.push([]);
        }

        const sortedPlayers = this.players.sort((a, b) => b.skillLevel - a.skillLevel);
        let playerIndex = 0;

        for (let j = 0; j < groupSize; j++) {
            for (let i = 0; i < this.numberOfTeams; i++) {
                groups[j].push(sortedPlayers[playerIndex++]);
            }
        }

        const teams = [];
        for (let i = 0; i < this.numberOfTeams; i++) {
            teams.push(new Team(`קבוצה ${i + 1}`));
        }

        for (const group of groups) {
            const shuffledGroup = group.sort(() => Math.random() - 0.5);
            let teamIndex = 0;
            for (const player of shuffledGroup) {
                teams[teamIndex++].addPlayer(player);
            }
        }

        return teams;
    }

    private buildDataSource(): void {
        this.dataSource = [];
        for (let i = 0; i < this.players.length / this.teams.length; i++) {
            const dataItem: { [key: string]: Player } = {};
            for (const team of this.teams) {
                if (team.getPlayers().length > i) {
                    const player = team.getPlayers()[i];
                    dataItem[team.name] = player;
                }
            }
            this.dataSource.push(dataItem);
        }

        this.teamsMap = this.teams.map(team => {
            const teamMap: { [key: string]: Team } = {};
            teamMap[team.name] = team;
            return teamMap;
        });
    }

    public getTeamByName(name: string): Team | undefined {
        for (const teamMap of this.teamsMap) {
            if (teamMap[name]) {
                return teamMap[name];
            }
        }
        return undefined;
    }
}