import {Component, OnDestroy} from '@angular/core';
import {UserService} from "./user.service";
import {Subject, takeUntil} from "rxjs";
import {EventsService} from "./events.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  isLoggedIn: boolean = false;
  isRegistering: boolean = false;
  test: boolean = false;

  onDestroy = new Subject();

  constructor(private userService: UserService, private eventsService: EventsService) {
    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe(account => {
      this.isLoggedIn = account ? true : false;
    });
    this.userService.$isRegistering.pipe(takeUntil(this.onDestroy)).subscribe(isRegistering => {
      this.isRegistering = isRegistering;
    });
    this.eventsService.$test.pipe(takeUntil(this.onDestroy)).subscribe(test => {
      this.test = test;
    });
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
