import {Component, OnDestroy} from '@angular/core';
import {UserService} from "./user.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  isLoggedIn: boolean = false;
  isRegistering: boolean = false;

  onDestroy = new Subject();

  constructor(
    private accountService: UserService,
  ) {
    this.accountService.$user
      .pipe(takeUntil(this.onDestroy))
      .subscribe(account => {
        this.isLoggedIn = account ? true : false;
      });
    this.accountService.$isRegistering
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isRegistering => {
        this.isRegistering = isRegistering;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
