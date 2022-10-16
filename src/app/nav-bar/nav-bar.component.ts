import {Component, OnDestroy} from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../user.service";
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

  constructor(private userService: UserService, private eventsService: EventsService) {
    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.user = user
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onTestClick() {
    this.eventsService.$test.next(true);
  }
  onLogoutClick() {
    this.userService.logout();
  }

  // onSearchTextChange(text: string) {
  //   this.eventsService.onSearchTextChange(text);
  // }

}
