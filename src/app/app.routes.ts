import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MeGustaComponent } from './pages/me-gusta/me-gusta.component';
import { PreguntaComponent } from './pages/pregunta/pregunta.component';
import { CelebracionComponent } from './pages/celebracion/celebracion.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'me-gusta', component: MeGustaComponent },
  { path: 'pregunta', component: PreguntaComponent },
  { path: 'celebracion', component: CelebracionComponent },
  { path: '**', redirectTo: '' }
];
