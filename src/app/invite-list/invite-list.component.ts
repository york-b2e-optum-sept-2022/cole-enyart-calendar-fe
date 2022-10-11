import {Component, OnDestroy} from '@angular/core';
import {InvitesService} from "../invites.service";
import {Subject, takeUntil} from "rxjs";
import {IUser} from "../_interfaces/IUser";

@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.component.html'
})
export class InviteListComponent implements OnDestroy {

  inviteList: IUser[] = [];
  errorMessage: string | null = null;

  onDestroy = new Subject();

  constructor(private invitesService: InvitesService) {
    this.invitesService.$inviteList.pipe(takeUntil(this.onDestroy)).subscribe(
      inviteList => this.inviteList = inviteList
    );
    this.invitesService.$inviteListError.pipe(takeUntil(this.onDestroy)).subscribe(
      message => this.errorMessage = message
    )
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
