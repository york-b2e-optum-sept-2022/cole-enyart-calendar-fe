import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {IEvent} from "./_interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  _eventList: IEvent[] = [];
  $eventList = new BehaviorSubject<IEvent[]>([]);
  $eventListError = new BehaviorSubject<string | null>(null);

  private readonly EVENT_LIST_HTTP_ERROR = 'Unable to get the list of events, please try again later';

  constructor(private httpService: HttpService) {
    this.httpService.getEventList().pipe(first()).subscribe({
      next: eventList => {
        this._eventList = eventList;
        this.$eventList.next(eventList);
      },
      error: (err) => {
        console.error(err);
        this.$eventListError.next(this.EVENT_LIST_HTTP_ERROR);
      }
    });
  }

  onSearchTextChange(searchText: string) {
    this.$eventList.next(
      this._eventList.filter(event => event.name.toUpperCase().includes(searchText.toUpperCase()))
    );
  }


}
