import {Injectable, OnDestroy} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {IEvent} from "./_interfaces/IEvent";
import {IUser} from "./_interfaces/IUser";
import {UserService} from "./user.service";
import {v4 as uuidv4} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {

  user!: IUser;
  $user = new Subject<IUser[]>();

  $close = new BehaviorSubject<boolean>(false);

  $eventList = new BehaviorSubject<IEvent[]>([]);
  $inviteList = new BehaviorSubject<IEvent[]>([]);
  $event = new BehaviorSubject<IEvent | null>(null);

  $eventListError = new BehaviorSubject<string | null>(null);

  $createEventError = new BehaviorSubject<string | null>(null);

  private readonly EVENT_LIST_HTTP_ERROR = 'Unable to get the list of events, please try again later';

  private readonly CREATE_EVENT_INVALID_DATE = 'You must provide a valid date';
  private readonly CREATE_EVENT_INVALID_NAME = 'You must provide a valid name';
  private readonly CREATE_EVENT_INVALID_DESC = 'You must provide a valid description';
  private readonly CREATE_EVENT_INVALID_INVITE = 'You must provide a valid invite email';
  private readonly CREATE_EVENT_INVALID_SELF = 'You must cannot invite yourself to Event';

  onDestroy = new Subject();

  constructor(private httpService: HttpService, private userService: UserService) {
    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe((user) => {
      if (user === null) {
        return;
      }
      this.user = user;
      this.$eventList.next(user.eventList);
      this.$inviteList.next(user.inviteList);
      this.sort(this.user);
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  addEventToUser(form: IEvent) {
    console.log("addEventToUser:", form, this.$close.getValue());

    if (form.dp.valueOf() < 1) {
      this.$createEventError.next(this.CREATE_EVENT_INVALID_DATE);
      return;
    }
    if (form.name.length < 1) {
      this.$createEventError.next(this.CREATE_EVENT_INVALID_NAME);
      return;
    }
    if (form.description.length < 1) {
      this.$createEventError.next(this.CREATE_EVENT_INVALID_DESC);
      return;
    }

    const event = this.$eventList.getValue();
    form.id = uuidv4();
    event.push(form);

    this.$eventList.next(this.user.eventList);
    this.$inviteList.next(this.user.inviteList);

    const user: IUser = {
      id: this.user.id,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: this.user.password,
      eventList: event,
      inviteList: this.user.inviteList,
    };

    if (form.invite.length < 1) {
      this.saveUser(user);
      this.$close.next(true);
    } else {
      this.findEmail(form, user);
    }

  }

  findEmail(form: IEvent, user: IUser) {
    console.log("findEmail:", form.invite);

    if (form.invite === this.user.email) {
      this.$createEventError.next(this.CREATE_EVENT_INVALID_SELF);
      return;
    }

    this.httpService.findUsersByEmail(form.invite).pipe(first()).subscribe({
      next: (userList) => {
        const foundAccount = userList.find(
          account => account.email === form.invite
        );
        console.log(foundAccount);
        if (foundAccount === undefined) {
          this.$createEventError.next(this.CREATE_EVENT_INVALID_INVITE);
          return;
        }

        const invite = foundAccount.inviteList;
        invite.push(form);

        const invitee: IUser = {
          id: foundAccount.id,
          email: foundAccount.email,
          firstName: foundAccount.firstName,
          lastName: foundAccount.lastName,
          password: foundAccount.password,
          eventList: foundAccount.eventList,
          inviteList: invite,
        }

        this.saveUser(user);
        this.addInviteToUser(invitee);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addInviteToUser(invitee: IUser) {
    console.log("addInviteToUser:", invitee);

    this.httpService.updateUser(invitee).pipe(first()).subscribe({
      next: () => {
        this.$user.next([this.user]);
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.$close.next(true);
  }


  viewEvent(event: IEvent) {
    console.log("viewEvent:", event);
    if (this.$event !== null) {
      this.$event.next(event);
    }
  }

  removeEventFromUser(event: IEvent) {
    console.log("removeEventFromUser:", event);

    const user = this.user;

    const eventIndex = user.eventList.findIndex(eventItem => eventItem.id === event.id);

    user.eventList.splice(eventIndex, 1);
    console.log("eventList:", user.eventList);

    this.saveUser(user);
  }

  removeInviteFromUser(event: IEvent) {
    console.log("removeInviteFromUser:", event);

    const user = this.user;

    const inviteIndex = user.inviteList.findIndex(eventItem => eventItem.id === event.id);
    console.log("inviteIndex:", inviteIndex);
    user.inviteList.splice(inviteIndex, 1);

    this.saveUser(user);
  }

  updateEventForUser(oldEvent: IEvent, newEvent: IEvent) {
    console.log("updateEventForUser:", "old:", oldEvent, "new:", newEvent);

    const user = this.user;

    const eventValue = user.eventList.find(eventItem => eventItem.id === oldEvent.id);
    if (!eventValue) {
      return;
    }

    eventValue.dp = newEvent.dp;
    eventValue.name = newEvent.name;
    eventValue.description = newEvent.description;
    eventValue.invite = newEvent.invite;

    this.saveUser(user);
    this.findEmail(newEvent, user);
  }

  saveUser(user: IUser) {
    console.log("saveUser:", user);
    this.httpService.updateUser(user).pipe(first()).subscribe({
      next: (user) => {
        this.$user.next(user);
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.sort(user);
  }

  sort(user: IUser) {
    console.log("sort:", user.eventList, user.inviteList);

    const mapEvents = user.eventList.map((obj) => {
      return {...obj, dp: new Date(obj.dp)};
    })

    const sortedAscEvents = mapEvents.sort((objA, objB) => objA.dp.getTime() - objB.dp.getTime());

    this.$eventList.next(sortedAscEvents);

    const mapInvites = user.inviteList.map((obj) => {
      return {...obj, dp: new Date(obj.dp)};
    })
    const sortedAscInvites = mapInvites.sort((objA, objB) => objA.dp.getTime() - objB.dp.getTime());

    this.$inviteList.next(sortedAscInvites);
  }
}
