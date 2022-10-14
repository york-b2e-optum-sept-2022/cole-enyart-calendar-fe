import {Component} from '@angular/core';
import {NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-modal-create-event',
  templateUrl: './modal-create-event.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class ModalCreateEventComponent {

  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService) {
  }

  onCreateEventClick(form: NgForm) {
    this.eventsService.addEventToUser(form.value as IEvent);
    this.eventsService.addInviteToUser(form.value as IEvent);
  }

}
