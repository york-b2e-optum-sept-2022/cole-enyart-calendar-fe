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
  $eventListError = new BehaviorSubject<string | null>(null);

  private readonly EVENT_LIST_HTTP_ERROR = 'Unable to get the list of events, please try again later';

  onDestroy = new Subject();

  constructor(private httpService: HttpService, private userService: UserService) {

    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe((event) => {
      if (event === null) {
        return;
      }
      this.$eventList.next(event.eventList);
      console.log(this.$eventList);
    })


    // this.httpService.getUserList().pipe(first()).subscribe({
    //   next: eventList => {
    //     this._eventList = eventList;
    //     this.$eventList.next(eventList);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.$eventListError.next(this.EVENT_LIST_HTTP_ERROR);
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  // onSearchTextChange(searchText: string) {
  //   this.$eventList.next(
  //     this._eventList.filter(event => event.name.toUpperCase().includes(searchText.toUpperCase()))
  //   );
  // }


}
