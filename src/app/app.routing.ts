import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { recordComponent } from './record/record.component';
import { searchComponent } from './search/search.component';
import { CandidateComponent } from './Add Candidate/addcandidate.component';
import { startComponent } from './start/start.component';





const appRoutes: Routes = [
    { path: '', component: startComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'record/:id', component: recordComponent },
    { path: 'search', component: searchComponent },
    { path: 'addcandidate', component:  CandidateComponent},
    { path: 'start', component:  startComponent},
   

 

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);