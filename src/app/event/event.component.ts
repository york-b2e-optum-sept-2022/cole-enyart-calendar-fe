import {Component, Input} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {EventsService} from "../events.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent {

  @Input() event!: IEvent;
  @Input() viewInvites!: boolean;

  constructor(private eventsService: EventsService) {
  }

  // onAddToCartClick() {
  //   this.cartService.addProductToCart(this.event);
  // }
  //
  // onIncreaseCartCount() {
  //   this.cartService.updateCartCount(
  //     this.event, this.cartCount + 1
  //   );
  // }
  //
  // onDecreaseCartCount() {
  //   this.cartService.updateCartCount(
  //     this.event, this.cartCount - 1
  //   );
  // }
  //
  // onRemoveProduct() {
  //   this.cartService.removeItemFromCart(this.event);
  // }
}
