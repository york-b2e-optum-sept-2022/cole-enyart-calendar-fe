import {Component, OnDestroy} from '@angular/core';
import {NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";
import {NgForm} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-modal-create-event',
  templateUrl: './modal-create-event.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class ModalCreateEventComponent implements OnDestroy {

  closeModal: boolean = false;
  createEventErrorMessage: string | null = null;
  unknownErrorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService) {
    this.eventsService
      .$eventError
      .pipe(takeUntil(this.onDestroy))
      .subscribe(message => this.createEventErrorMessage = message);

    this.eventsService.$unknownError.pipe(takeUntil(this.onDestroy)).subscribe(
      message => this.unknownErrorMessage = message
    );

    this.eventsService
      .$close
      .pipe(takeUntil(this.onDestroy))
      .subscribe(close => {
        this.closeModal = close
        if (this.closeModal) {
          this.activeModal.close('Close click');
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onCreateEventClick(form: NgForm) {
    this.eventsService.addEventToUser(form.value as IEvent)
  }
}
