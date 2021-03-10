import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from './auth/auth.guard';
import {UsersListComponent} from './users/users-list/users-list.component';
import {StatisticsComponent} from './statistics/statistics.component';
const routes : Routes=[
  {path:'',component:PostListComponent},
  {path:'create',component: PostCreateComponent,canActivate: [AuthGuard]},
  {path:'edit/:postId',component: PostCreateComponent,canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'users', component:UsersListComponent},
  {path: 'statistics',component:StatisticsComponent}
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule{

}
