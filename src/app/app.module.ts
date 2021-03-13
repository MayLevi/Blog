import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule, MatPaginatorModule, MatIconModule, MatTableModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {StoryWrapperComponent} from '../react/StoryComponentWrapper';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {PostSocketService} from './posts/post-socket.service';
import { UsersListComponent } from './users/users-list/users-list.component';
import {MatSelectModule} from '@angular/material/select';
import { StatisticsComponent } from './statistics/statistics.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';


const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:3000', options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostListComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    StoryWrapperComponent,
    UsersListComponent,
    StatisticsComponent,
    BarChartComponent,
    PieChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    SocketIoModule.forRoot(socketIoConfig),
    MatSelectModule,
    MatIconModule,
    MatTableModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, PostSocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
