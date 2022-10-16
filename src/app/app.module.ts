import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RegisterComponent } from './register/register.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventComponent } from './event/event.component';
import { ModalCreateEventComponent } from './modal-create-event/modal-create-event.component';
import { ModalViewEventComponent } from './modal-view-event/modal-view-event.component';
import { InviteComponent } from './invite/invite.component';
import { ModalViewInviteComponent } from './modal-view-invite/modal-view-invite.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    RegisterComponent,
    EventListComponent,
    EventComponent,
    ModalCreateEventComponent,
    ModalViewEventComponent,
    InviteComponent,
    ModalViewInviteComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
