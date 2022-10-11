import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnDestroy {

  eventList: IEvent[] = [];
  errorMessage: string | null = null;

  onDestroy = new Subject();

  constructor(private eventsService: EventsService) {
      console.log(this.eventList);
    this.eventsService.$eventList.pipe(takeUntil(this.onDestroy)).subscribe(
      eventList => this.eventList = eventList
    );
    this.eventsService.$eventListError.pipe(takeUntil(this.onDestroy)).subscribe(
      message => this.errorMessage = message
    );

  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
