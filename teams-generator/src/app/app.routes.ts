import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { TeamsHomeComponent } from './teams/teams-home/teams-home.component';

export const routes: Routes = [
    { 
        path: '',
        component: LayoutComponent,
        children: [
            { 
                path: '',
                component: HomeComponent
            },
            {
                path: 'players',
                component: PlayerListComponent
            },
            {
                path: 'teams',
                component: TeamsHomeComponent
            }
        ]},
];
