import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IUser} from "./_interfaces/IUser";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  findUsersByEmail(email: string) {
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

  getUserList() {
    return this.httpClient.get(
      'http://localhost:3000/users'
    ) as Observable<IUser[]>
  }

}
