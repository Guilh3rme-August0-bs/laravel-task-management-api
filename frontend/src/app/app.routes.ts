import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { SignUp } from './pages/sign-up/sign-up';


export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', component: Home, 
        canActivate: [authGuard]
     },
    { path: 'signup', component: SignUp },
];
