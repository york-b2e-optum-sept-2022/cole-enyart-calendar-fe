import {Injectable, OnDestroy} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {IEvent} from "./_interfaces/IEvent";
import {IUser} from "./_interfaces/IUser";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy{

  _eventList: IUser[] = [];
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
      this.$eventList.next(event.eventList);
      this.$eventInviteList.next(event.inviteList);
      console.log(event.eventList);
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  addEventToUser() {
    console.log("add clicked");
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
