import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { DrawListComponent } from './draws/draw-list/draw-list.component';
import { CreateOrEditDrawComponent } from './draws/create-or-edit-draw/create-or-edit-draw.component';
import { DrawsHomeComponent } from './draws/draws-home/draws-home.component';

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
                path: 'draws',
                component: DrawsHomeComponent,
                children: [
                    {
                        path: '',
                        component: DrawListComponent
                    },
                    {
                        path: 'edit/:id',
                        component: CreateOrEditDrawComponent
                    },
                    {
                        path: 'new',
                        component: CreateOrEditDrawComponent
                    }
                ]
            }
        ]
    },
];
