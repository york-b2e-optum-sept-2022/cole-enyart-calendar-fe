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
  $event = new BehaviorSubject<IEvent | null>(null);
  $eventList = new BehaviorSubject<IEvent[]>([]);
  $inviteList = new BehaviorSubject<IEvent[]>([]);
  $close = new BehaviorSubject<boolean>(false);

  $eventError = new BehaviorSubject<string | null>(null);
  $unknownError = new BehaviorSubject<string | null>(null);

  private readonly ISO_INVALID_DATE = "invalid date, must be mm/dd/yyyy";
  private readonly EVENT_INVALID_NAME = 'You must provide a valid name';
  private readonly EVENT_INVALID_DESC = 'You must provide a valid description';
  private readonly EVENT_INVALID_INVITE = 'You must provide a valid invite email';
  private readonly EVENT_INVALID_SELF = 'You cannot invite yourself to an Event';

  private readonly HTTP_FIND_EMAIL = 'Unable to locate invitee email, please try again';
  private readonly HTTP_ADD_INVITE = 'Unable to add invite to invited user, please try again';
  private readonly HTTP_ADD_USER = 'Unable to update user, please try again';
  private readonly FIND_ID = 'Unable to find the id, please try again';
  private readonly USER = 'No user data, please try again';
  private readonly EVENT = 'No event data, please try again';
  private readonly EVENT_VIEW = 'Unable to load event, please try again';


  onDestroy = new Subject();

  constructor(private httpService: HttpService, private userService: UserService) {
    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe((user) => {
      if (user === null) {
        return;
      }
      this.user = user;
      this.$user.next([this.user]);
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
    if (!form) {
      console.error(form);
      this.$unknownError.next(this.EVENT);
      return;
    }
    try {
      form.dp.toISOString()
    } catch (error) {
      console.error(error);
      this.$eventError.next(this.ISO_INVALID_DATE);
      return;
    }

    if (form.name.length < 1) {
      this.$eventError.next(this.EVENT_INVALID_NAME);
      return;
    }
    if (form.description.length < 1) {
      this.$eventError.next(this.EVENT_INVALID_DESC);
      return;
    }

    const event = this.$eventList.getValue();
    form.id = uuidv4();
    event.push(form);

    try {
      this.$eventList.next(this.user.eventList);
    } catch (error) {
      console.error(error);
      this.$unknownError.next(this.EVENT);
      return;
    }
    try {
      this.$inviteList.next(this.user.inviteList);
    } catch (error) {
      console.error(error);
      this.$unknownError.next(this.EVENT);
      return;
    }

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
    if (!user) {
      console.error(user);
      this.$unknownError.next(this.USER);
      return;
    }
    if (!form) {
      console.error(form);
      this.$unknownError.next(this.EVENT);
      return;
    }
    if (form.invite === this.user.email) {
      console.error(form.invite === this.user.email);
      this.$eventError.next(this.EVENT_INVALID_SELF);
      return;
    }

    this.httpService.findUsersByEmail(form.invite).pipe(first()).subscribe({
      next: (userList) => {
        const foundAccount = userList.find(
          account => account.email === form.invite
        );
        console.log(foundAccount);
        if (foundAccount === undefined) {
          console.error(foundAccount);
          this.$eventError.next(this.EVENT_INVALID_INVITE);
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
        this.$unknownError.next(this.HTTP_FIND_EMAIL);
        return;
      }
    });
  }

  addInviteToUser(invitee: IUser) {
    console.log("addInviteToUser:", invitee);
    if (!invitee) {
      console.error(invitee);
      this.$unknownError.next(this.USER);
      return;
    }

    this.httpService.updateUser(invitee).pipe(first()).subscribe({
      next: () => {
        this.$user.next([this.user]);
      },
      error: (err) => {
        console.error(err);
        this.$unknownError.next(this.HTTP_ADD_INVITE);
        return;
      }
    });

    this.$close.next(true);
  }


  viewEvent(event: IEvent) {
    console.log("viewEvent:", event);
    if (!event) {
      console.error(event);
      this.$unknownError.next(this.EVENT_VIEW);
      return;
    }

    this.$event.next(event);
  }

  removeEventFromUser(event: IEvent) {
    console.log("removeEventFromUser:", event);
    if (!event) {
      console.error(event);
      this.$unknownError.next(this.EVENT);
      return;
    }

    const user = this.user;
    if (!user) {
      console.error(user);
      this.$unknownError.next(this.USER);
      return;
    }

    const eventIndex = user.eventList.findIndex(eventItem => eventItem.id === event.id);
    if (eventIndex === -1) {
      console.error(eventIndex);
      this.$unknownError.next(this.FIND_ID);
      return;
    }
    user.eventList.splice(eventIndex, 1);

    this.saveUser(user);
  }

  removeInviteFromUser(event: IEvent) {
    console.log("removeInviteFromUser:", event);
    if (!event) {
      console.error(event);
      this.$unknownError.next(this.EVENT);
      return;
    }

    const user = this.user;
    if (!user) {
      console.error(user);
      this.$unknownError.next(this.USER);
      return;
    }

    const inviteIndex = user.inviteList.findIndex(eventItem => eventItem.id === event.id);
    if (inviteIndex === -1) {
      console.error(inviteIndex);
      this.$unknownError.next(this.FIND_ID);
      return;
    }
    user.inviteList.splice(inviteIndex, 1);

    this.saveUser(user);
  }

  updateEventForUser(oldEvent: IEvent, newEvent: IEvent) {
    console.log("updateEventForUser:", "old:", oldEvent, "new:", newEvent);
    if (!oldEvent) {
      console.error(oldEvent);
      this.$unknownError.next(this.EVENT);
      return;
    }
    if (!newEvent) {
      console.error(newEvent);
      this.$unknownError.next(this.EVENT);
      return;
    }
    try {
      newEvent.dp.toISOString()
    } catch (error) {
      console.error(error);
      this.$eventError.next(this.ISO_INVALID_DATE);
      return;
    }

    const user = this.user;
    if (!user) {
      console.error(user);
      this.$unknownError.next(this.USER);
      return;
    }

    const eventValue = user.eventList.find(eventItem => eventItem.id === oldEvent.id);
    if (eventValue === undefined) {
      console.error(eventValue);
      console.log(oldEvent.id)
      console.log(user)
      this.$unknownError.next(this.FIND_ID);
      return;
    }

    eventValue.dp = newEvent.dp;
    eventValue.name = newEvent.name;
    eventValue.description = newEvent.description;
    eventValue.invite = newEvent.invite;

    if (newEvent.invite.length < 1) {
      this.saveUser(user);
      this.$close.next(true);
    } else {
      this.findEmail(eventValue, user);
    }
  }

  saveUser(user: IUser) {
    console.log("saveUser:", user);
    if (!user) {
      console.error(user);
      this.$unknownError.next(this.USER);
      return;
    }
    this.httpService.updateUser(user).pipe(first()).subscribe({
      next: (user) => {
        this.user = user[0];
        this.$user.next(user);
      },
      error: (err) => {
        console.error(err);
        this.$unknownError.next(this.HTTP_ADD_USER);
        return;
      }
    })

    this.sort(user);
  }

  sort(user: IUser) {
    console.log("sort:", user.eventList, user.inviteList);
    if (!user) {
      console.error(user);
      this.$unknownError.next(this.USER);
      return;
    }

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

    this.$unknownError.next(null);
  }
}
