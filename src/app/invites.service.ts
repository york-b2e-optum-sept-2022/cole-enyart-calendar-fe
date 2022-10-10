import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {IInvite} from "./_interfaces/IInvite";

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  _inviteList: IInvite[] = [];
  $inviteList = new BehaviorSubject<IInvite[]>([]);
  $isViewingInvites = new BehaviorSubject<boolean>(false);
  $inviteListError = new BehaviorSubject<string | null>(null);

  private readonly INVITE_LIST_HTTP_ERROR = 'Unable to get the list of invites, please try again later';

  constructor(private httpService: HttpService) {
    this.httpService.getInviteList().pipe(first()).subscribe({
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

  onSearchTextChange(searchText: string) {
    this.$inviteList.next(
      this._inviteList.filter(invite => invite.name.toUpperCase().includes(searchText.toUpperCase()))
    );
  }


}
