import {Component, Input, OnDestroy} from '@angular/core';
import {NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";
import {NgForm} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-modal-view-event',
  templateUrl: './modal-view-event.component.html'
})
export class ModalViewEventComponent implements OnDestroy {

  event!: IEvent;
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

  onDeleteEventClick(form: NgForm) {
    this.eventsService.removeEventFromUser(form.value as IEvent);
    console.log(this.event);
  }

}
