import {Component, OnDestroy} from '@angular/core';
import {UserService} from "../user.service";
import {NgForm} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {IRegistrationForm} from "../_interfaces/IRegistrationForm";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnDestroy {

  errorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private accountService: UserService) {
    this.accountService
      .$registrationError
      .pipe(takeUntil(this.onDestroy))
      .subscribe(message => this.errorMessage = message);
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onLoginClick() {
    this.accountService.$isRegistering.next(false);
  }

  onRegisterClick(form: NgForm) {
    this.accountService.register(
      form.value as IRegistrationForm
    );
  }

}
