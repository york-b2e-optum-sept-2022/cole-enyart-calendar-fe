import {Component, Input,} from '@angular/core';
import {IInvite} from "../_interfaces/IInvite";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html'
})
export class InviteComponent {

  @Input() invite!: IInvite;
  @Input() viewInvites!: boolean;
}
