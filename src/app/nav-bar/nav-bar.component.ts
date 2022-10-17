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

  user: IUser | null = null;
  unknownErrorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private userService: UserService, private eventsService: EventsService) {
    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.user = user
    });
    this.eventsService.$unknownError.pipe(takeUntil(this.onDestroy)).subscribe(
      message => this.unknownErrorMessage = message
    );
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onLogoutClick() {
    this.userService.logout();
  }
}
