import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './controllers/login/login.component';
import { EventsComponent } from './controllers/events/events.component';
import { ProjectsComponent } from './controllers/projects/projects.component';
import { NotificationsComponent } from './controllers/notifications/notifications/notifications.component';
import { CurulesComponent } from './controllers/curules/curules/curules.component';
import { DashboardComisionComponent } from './comision/controllers/dashboard-comision/dashboard-comision.component';
import { InplenaryLiveComponent } from 'app/directives/inplenary/inplenary-live/inplenary-live.component';
import { CommissionsComponent } from './comision/controllers/commissions/commissions.component';
import { EventsCommissionsComponent } from './comision/controllers/events/events-commissions.component';
import { AdminDashboardComponent } from './admin/controllers/admin-dashboard/admin-dashboard.component';
import { PartiesComponent } from './admin/controllers/parties/parties.component';
import { SenatorsComponent } from './admin/controllers/senators/senators.component';
import { GeneralService } from 'app/services/general.service';
import { CategoriesComponent } from './admin/controllers/categories/categories.component';
import { WhippersComponent } from './admin/controllers/whippers/whippers.component';
import { SessionsComponent } from './admin/controllers/sessions/sessions.component';
import { ProbeComponent } from './admin/controllers/probe/probe.component';
import { ProbeResultsComponent } from './admin/controllers/probe/probe-results.component';
import { NotFound404Component } from './controllers/not-found404/not-found404.component';
import { AdministratorsComponent } from './admin/controllers/administrators/administrators.component';

import { GuardAdminService } from 'app/services/guard-admin.service';
import { GuardCommisionService } from 'app/services/guard-commision.service';
import { GuardPlenaryService } from './services/guard-plenary.service';





export const router: Routes = [
  //GENERAL
  { path:'', redirectTo:'login', pathMatch:'full' },
  { path:'login',component: LoginComponent },
  
  // PLENARIA
  { path:'events', canActivate: [GuardPlenaryService], component: EventsComponent },
  { path:'projects', canActivate: [GuardPlenaryService], component: ProjectsComponent },
  { path:'notifications', canActivate: [GuardPlenaryService], component: NotificationsComponent },
  { path:'curules', canActivate: [GuardPlenaryService], component: CurulesComponent },
  { path:'inplenary-live', canActivate: [GeneralService],component: InplenaryLiveComponent },

  //COMISON
  { path:'dashboard-comision', canActivate: [GuardCommisionService], component: DashboardComisionComponent },
  { path:'commissions', canActivate: [GuardCommisionService], component: CommissionsComponent },
  { path:'events-commission', canActivate: [GuardCommisionService], component: EventsCommissionsComponent },

  //ADMIN
  { path: 'admin-dashboard', canActivate: [GuardAdminService], component: AdminDashboardComponent},
  { path: 'parties', canActivate: [GuardAdminService], component: PartiesComponent},
  { path: 'senators', canActivate: [GuardAdminService], component: SenatorsComponent},
  { path: 'categories', canActivate: [GuardAdminService], component: CategoriesComponent},
  { path: 'whippers', canActivate: [GuardAdminService], component: WhippersComponent},
  { path: 'sessions', canActivate: [GuardAdminService], component: SessionsComponent},
  { path: 'probe', canActivate: [GuardAdminService], component: ProbeComponent},
  { path: 'probe-results/:id', canActivate: [GuardAdminService], component: ProbeResultsComponent},
  { path: 'administrators', canActivate: [GuardAdminService], component: AdministratorsComponent},

   //NOT FOUND 404
  { path: '**', component: NotFound404Component},

];

export const routes: ModuleWithProviders = RouterModule.forRoot( router );
