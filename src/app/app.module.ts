import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, enableProdMode, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { routes } from './app.router';

import { DpDatePickerModule } from 'ng2-date-picker';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { CalendarModule } from 'angular-calendar';
import { SafePipe } from './filters/safe.pipe';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ColorPickerModule } from 'ng-color-picker';
import { SelectModule } from 'ng2-select';

import { AppComponent } from './app.component';

import { ModalDeleteComponent } from './layouts/modal/delete.component';
import { ModalLinkComponent } from './layouts/modal/link.component';
import { ModalCloseComponent } from './layouts/modal/close.component';
import { ModalPasswordComponent } from './layouts/modal/password.component';
import { ModalResetPasswordComponent } from './layouts/modal/resetPassword.component';

import { NavbarComponent } from './layouts/navbar/navbar.component';
import { InplenaryComponent } from './directives/inplenary/inplenary.component';
import { InPlenaryNewComponent } from './directives/inplenary/inplenary.new';
import { TagsComponent } from './directives/tags/tags.component';

import { LoginComponent } from './controllers/login/login.component';
import { EventsComponent } from './controllers/events/events.component';
import { EventComponent } from './controllers/events/event.component';
import { ProjectsComponent } from './controllers/projects/projects.component';
import { ProjectComponent } from './controllers/projects/project.component';
import { SidebarComponent } from './layouts/sidebar/sidebar/sidebar.component';
import { NotificationsComponent } from './controllers/notifications/notifications/notifications.component';
import { CurulesComponent } from './controllers/curules/curules/curules.component';
import { InplenaryLiveComponent } from './directives/inplenary/inplenary-live/inplenary-live.component';

//dataFake
import { DataFake } from './controllers/notifications/notifications/dataFake';

import { ComposerComponent } from './controllers/notifications/composer/composer.component';
import { CurulesDirectiveComponent } from './directives/curules-directive/curules-directive.component';
import { DashboardComisionComponent } from './comision/controllers/dashboard-comision/dashboard-comision.component';
import { SessionComponent } from './comision/controllers/dashboard-comision/session.component';
import { EventsCommissionsComponent } from './comision/controllers/events/events-commissions.component';
import { NewEventCommissionComponent } from './comision/controllers/events/new.events-commissions.component';
import { CommissionsComponent } from './comision/controllers/commissions/commissions.component';
import { NewCommissionsComponent } from './comision/controllers/commissions/new.commissions.component';
import { AdminDashboardComponent } from './admin/controllers/admin-dashboard/admin-dashboard.component';
import { PartiesComponent } from './admin/controllers/parties/parties.component';
import { PartiesNewComponent } from './admin/controllers/parties/parties-new.component';
import { SenatorsComponent } from './admin/controllers/senators/senators.component';
import { NewSenatorsComponent } from './admin/controllers/senators/new.senators.component';

import { SessionsListComponent } from './admin/controllers/admin-dashboard/sessions-list/sessions-list.component';
import { SenatorsListComponent } from './admin/controllers/admin-dashboard/senators-list/senators-list.component';
import { SessionsAnalyticsComponent } from './admin/controllers/admin-dashboard/session-analytics/session-analytics.component';
import { SenatorAnalyticsComponent } from './admin/controllers/admin-dashboard/senator-analytics/senator-analytics.component';

// Servicios
import { CurulesService } from './services/curules.service';
import { EndPointsService } from './services/endpoints.service';
import { GlobalConfigService } from 'app/services/global-config.service';
import { StorageService } from 'app/services/storage.service';
import { GeneralService } from './services/general.service';
import { NotifyService } from './services/notify.service';
import { AuthService } from 'app/services/auth.service';
import { GuardAdminService } from 'app/services/guard-admin.service';
import { GuardPlenaryService } from 'app/services/guard-plenary.service';
import { GuardCommisionService } from './services/guard-commision.service';

// Pipes
import { DomSeguroPipe } from './pipes/dom-seguro.pipe';


import { NewBillComponent } from './directives/inplenary/inplenary-live/new-bill.component';
import { ChipsComponent } from './directives/chips/chips/chips.component';
import { SearchBillComponent } from './directives/inplenary/inplenary-live/search-bill.component';

import { CategoriesComponent } from './admin/controllers/categories/categories.component';
import { CategoriesNewComponent } from './admin/controllers/categories/categories-new.component';
import { WhippersComponent } from './admin/controllers/whippers/whippers.component';
import { WhippersNewComponent } from './admin/controllers/whippers/whippers-new.component';
import { SessionsComponent } from './admin/controllers/sessions/sessions.component';
import { SessionsNewComponent } from './admin/controllers/sessions/sessions-new.component';
import { ProbeComponent } from './admin/controllers/probe/probe.component';
import { ProbeNewComponent } from './admin/controllers/probe/probe-new.component';
import { ProbeResultsComponent } from './admin/controllers/probe/probe-results.component';
import { NewUrlStreamingComponent } from './directives/inplenary/new-url-streaming/new-url-streaming.component';
import { NotFound404Component } from './controllers/not-found404/not-found404.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SchedulesComponent } from './directives/schedules/schedules.component';
import { FromNowPipe } from './pipes/from-now.pipe';
import { NewBillAdminComponent } from './admin/controllers/sessions/new-bill-admin.component';
import { AdministratorsComponent } from './admin/controllers/administrators/administrators.component';
import { AdministratorsNewComponent } from './admin/controllers/administrators/new.administrator.component';
import { ShowVotationComponent } from './directives/inplenary/inplenary-live/show-votation.component';
import { ConfigurationsApp } from 'config';



enableProdMode();

@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    ModalDeleteComponent,
    ModalLinkComponent,
    ModalCloseComponent,
    ModalPasswordComponent,
    ModalResetPasswordComponent,
    NavbarComponent,
    LoginComponent,
    EventsComponent,
    EventComponent,
    InplenaryComponent,
    InPlenaryNewComponent,
    ProjectsComponent,
    ProjectComponent,
    SidebarComponent,
    NotificationsComponent,
    CurulesComponent,
    ComposerComponent,
    CurulesDirectiveComponent,
    InplenaryLiveComponent,
    DashboardComisionComponent,
    SessionComponent,
    CommissionsComponent,
    NewCommissionsComponent,
    AdminDashboardComponent,
    PartiesComponent,
    PartiesNewComponent,
    SenatorsComponent,
    NewSenatorsComponent,
    DomSeguroPipe,
    NewBillComponent,
    ChipsComponent,
    SearchBillComponent,
    CategoriesComponent,
    CategoriesNewComponent,
    WhippersComponent,
    WhippersNewComponent,
    SessionsComponent,
    SessionsNewComponent,
    ProbeComponent,
    ProbeNewComponent,
    ProbeResultsComponent,
    NewUrlStreamingComponent,
    NotFound404Component,
    TagsComponent,
    SchedulesComponent,
    EventsCommissionsComponent,
    NewEventCommissionComponent,
    FromNowPipe,
    SessionsListComponent,
    SenatorsListComponent,
    SessionsAnalyticsComponent,
    SenatorAnalyticsComponent,
    NewBillAdminComponent,
    AdministratorsComponent,
    AdministratorsNewComponent,
    ShowVotationComponent
  ],
  imports: [
    routes,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    DpDatePickerModule,
    Ng2FilterPipeModule,
    Ng2OrderModule,
    AmChartsModule,
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(ConfigurationsApp.FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ColorPickerModule,
    SelectModule,
    InfiniteScrollModule],
  exports: [
    DomSeguroPipe
  ],
  providers: [
    DataFake,
    CurulesService,
    EndPointsService,
    GlobalConfigService,
    StorageService,
    GeneralService,
    NotifyService,
    AuthService,
    GuardAdminService,
    GuardPlenaryService,
    GuardCommisionService,
    { provide: LOCALE_ID, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
