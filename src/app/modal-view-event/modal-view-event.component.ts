import {Component, Injectable, OnDestroy} from '@angular/core';
import {
  NgbActiveModal,
  NgbDateAdapter, NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDateStruct
} from "@ng-bootstrap/ng-bootstrap";
import {EventsService} from "../events.service";
import {IEvent} from "../_interfaces/IEvent";
import {NgForm} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-modal-view-event',
  templateUrl: './modal-view-event.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]

})
export class ModalViewEventComponent implements OnDestroy {

  date!: string;

  event: IEvent | null = null;
  isEditing: boolean = false;
  viewEventErrorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService, private dateAdapter: NgbDateAdapter<string>) {
    this.eventsService.$event.pipe(takeUntil(this.onDestroy)).subscribe({
        next: (event) => {
          this.event = event
          if (event) {
            this.date = this.dateAdapter.toModel({
              year: event.dp.getFullYear(),
              month: event.dp.getMonth() + 1,
              day: event.dp.getDate()
            })!
          }
        },
        error: (err) => {
          console.error(err);
        }
      }
    )

    this.eventsService
      .$createEventError
      .pipe(takeUntil(this.onDestroy))
      .subscribe(message => this.viewEventErrorMessage = message);
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

  onSaveEventClick(event: IEvent, form: NgForm) {
    this.eventsService.updateEventForUser(event, form.value as IEvent);
  }

  onDeleteEventClick(event: IEvent) {
    this.eventsService.removeEventFromUser(event);
  }

}
