import {Component, OnDestroy} from '@angular/core';
import {NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";
import {NgForm} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-modal-view-event',
  templateUrl: './modal-view-event.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class ModalViewEventComponent implements OnDestroy {

  event: IEvent | null = null;
  isEditing: boolean = false;
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

  onEditEventClick() {
    this.isEditing = true;
  }

  onBackEventClick() {
    this.isEditing = false;
  }

  onSaveEventClick(id: string, form: NgForm) {
    this.eventsService.updateEventForUser(id, form.value as IEvent);
  }

  onDeleteEventClick(event: IEvent) {
    this.eventsService.removeEventFromUser(event);
  }

}
