import {Component, Input,} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html'
})
export class InviteComponent {

  @Input() invite!: IEvent;
  @Input() viewInvites!: boolean;
}
