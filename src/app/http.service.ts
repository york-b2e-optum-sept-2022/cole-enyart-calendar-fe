import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IUser} from "./_interfaces/IUser";
import {IEvent} from "./_interfaces/IEvent"
import {IInvite} from "./_interfaces/IInvite";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  findAccountsByEmail(email: string) {
    return this.httpClient.get(
      'http://localhost:3000/users?email=' + email,
    ) as Observable<IUser[]>;
  }

  register(form: IUser) {
    return this.httpClient.post(
      'http://localhost:3000/users',
      form
    ) as Observable<IUser>;
  }

  getEventList() {
    return this.httpClient.get(
      'http://localhost:3000/users'
    ) as Observable<IEvent[]>
  }

  getInviteList() {
    return this.httpClient.get(
      'http://localhost:3000/users'
    ) as Observable<IInvite[]>
  }

}
