import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {IUser} from "./_interfaces/IUser";

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  _inviteList: IUser[] = [];
  $inviteList = new BehaviorSubject<IUser[]>([]);
  $isViewingInvites = new BehaviorSubject<boolean>(false);
  $inviteListError = new BehaviorSubject<string | null>(null);

  private readonly INVITE_LIST_HTTP_ERROR = 'Unable to get the list of invites, please try again later';

  constructor(private httpService: HttpService) {
    this.httpService.getUserList().pipe(first()).subscribe({
      next: inviteList => {
        this._inviteList = inviteList;
        this.$inviteList.next(inviteList);
      },
      error: (err) => {
        console.error(err);
        this.$inviteListError.next(this.INVITE_LIST_HTTP_ERROR);
      }
    });
  }

  // onSearchTextChange(searchText: string) {
  //   this.$inviteList.next(
  //     this._inviteList.filter(invite => invite.name.toUpperCase().includes(searchText.toUpperCase()))
  //   );
  // }


}
