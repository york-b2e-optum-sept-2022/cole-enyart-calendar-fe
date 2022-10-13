import {Component, Input} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalViewEventComponent} from "../modal-view-event/modal-view-event.component";
import {Subject} from "rxjs";
import {EventsService} from "../events.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent {

  @Input() event!: IEvent;

  constructor(private modalService: NgbModal, private eventsService: EventsService) {

  }

  onViewEventClick() {
    this.eventsService.viewEvent(this.event);
    this.modalService.open(ModalViewEventComponent);
  }

}
