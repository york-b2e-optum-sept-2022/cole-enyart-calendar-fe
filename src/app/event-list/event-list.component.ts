import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalCreateEventComponent} from "../modal-create-event/modal-create-event.component";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnDestroy {

  eventList: IEvent[] = [];
  inviteList: IEvent[] = [];
  errorMessage: string | null = null;

  onDestroy = new Subject();

  constructor(private eventsService: EventsService, private modalService: NgbModal) {
    this.eventsService.$eventList.pipe(takeUntil(this.onDestroy)).subscribe(
      eventList => this.eventList = eventList
    );
    this.eventsService.$inviteList.pipe(takeUntil(this.onDestroy)).subscribe(
      eventInviteList => this.inviteList = eventInviteList
    );
    this.eventsService.$eventListError.pipe(takeUntil(this.onDestroy)).subscribe(
      message => this.errorMessage = message
    );
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  openModal() {
    this.modalService.open(ModalCreateEventComponent);
  }

}
