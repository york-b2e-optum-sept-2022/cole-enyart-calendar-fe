import {Component, OnDestroy} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {Subject, takeUntil} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";

@Component({
  selector: 'app-modal-view-invite',
  templateUrl: './modal-view-invite.component.html'
})
export class ModalViewInviteComponent implements OnDestroy {

  event: IEvent | null = null;
  onDestroy = new Subject();

  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService) {
    this.eventsService.$event.pipe(takeUntil(this.onDestroy)).subscribe(
      event => this.event = event
    );
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onDeleteEventClick(event: IEvent) {
    this.eventsService.removeEventFromUser(event);
  }

}
