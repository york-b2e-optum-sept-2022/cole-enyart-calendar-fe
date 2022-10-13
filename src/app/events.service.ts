import {Injectable, OnDestroy} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {IEvent} from "./_interfaces/IEvent";
import {IUser} from "./_interfaces/IUser";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy{

  _eventList: IUser[] = [];
  user!: IUser;
  $user = new Subject<IUser[]>();
  // $user = new BehaviorSubject<IUser | null>( null);
  $eventList = new BehaviorSubject<IEvent[]>([]);
  $eventInviteList = new BehaviorSubject<IEvent[]>([]);
  $eventListError = new BehaviorSubject<string | null>(null);

  private readonly EVENT_LIST_HTTP_ERROR = 'Unable to get the list of events, please try again later';

  onDestroy = new Subject();

  constructor(private httpService: HttpService, private userService: UserService) {

    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe((event) => {
      if (event === null) {
        return;
      }
      this.user = event;
      this.$eventList.next(event.eventList);
      this.$eventInviteList.next(event.inviteList);
      console.log(event.eventList);
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  addEventToUser(form: IEvent) {
    console.log("add clicked", form);

    const calendar = this.$eventList.getValue();
    calendar.push(form);

    const user: IUser = {
      id: this.user.id,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: this.user.password,
      eventList: calendar,
      inviteList: this.user.inviteList,
    }

    this.httpService.createEvent(user).pipe(first()).subscribe({
      next: (user) => {
        this.$user.next(user);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  removeEventFromUser(event: IEvent) {
    console.log("remove clicked", event);
  }

  // onSearchTextChange(searchText: string) {
  //   this.$eventList.next(
  //     this._eventList.filter(event => event.name.toUpperCase().includes(searchText.toUpperCase()))
  //   );
  // }


}
