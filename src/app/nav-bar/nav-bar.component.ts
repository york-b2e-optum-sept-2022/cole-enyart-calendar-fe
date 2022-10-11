import {Component, OnDestroy} from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../user.service";
import {InvitesService} from "../invites.service";
import {EventsService} from "../events.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent implements OnDestroy {
  searchText = "";
  user: IUser | null = null;
  inviteCount: number | null = null;
  isViewingInvites: boolean = false;

  onDestroy = new Subject();

  constructor(
    private userService: UserService,
    private eventsService: EventsService,
    private invitesService: InvitesService
  ) {
    this.userService.$user
      .pipe(takeUntil(this.onDestroy))
      .subscribe(user => {
        this.user = user
      })
    this.userService.$user
      .pipe(takeUntil(this.onDestroy))
      .subscribe(invite => {
        this.inviteCount = invite?.inviteList?.length ?? null
      });
    this.invitesService.$isViewingInvites
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isViewingInvites => {
        this.isViewingInvites = isViewingInvites
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onInviteClick() {
    this.invitesService.$isViewingInvites.next(!this.isViewingInvites)
  }

  onLogoutClick() {
    this.userService.logout();
  }

  // onSearchTextChange(text: string) {
  //   this.eventsService.onSearchTextChange(text);
  // }

}
