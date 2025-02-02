import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppPaginatorIntl } from './core/app-paginator-intl';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(),
  provideNativeDateAdapter(),
  { provide: MAT_DATE_LOCALE, useValue: 'he' },
  { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
  provideFirebaseApp(() => initializeApp({ projectId: "soccer-hazorea", appId: "1:941313057987:web:15dd9641232203f9f82e76", databaseURL: "https://soccer-hazorea-default-rtdb.firebaseio.com", storageBucket: "soccer-hazorea.firebasestorage.app", apiKey: "AIzaSyAdBU0nZ9ogVcOYcrlCbz4Ofi_per7dgmk", authDomain: "soccer-hazorea.firebaseapp.com", messagingSenderId: "941313057987", measurementId: "G-2FT9XWP5JT" })),
  //provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideDatabase(() => getDatabase()),
  ]
};
