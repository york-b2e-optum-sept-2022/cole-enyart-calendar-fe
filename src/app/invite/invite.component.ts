import {Component, Input} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";
import {ModalViewInviteComponent} from "../modal-view-invite/modal-view-invite.component";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html'
})
export class InviteComponent {

  @Input() event!: IEvent;

  constructor(private modalService: NgbModal, private eventsService: EventsService) {

  }

  onViewEventClick() {
    this.eventsService.viewEvent(this.event);
    this.modalService.open(ModalViewInviteComponent);
  }

}
