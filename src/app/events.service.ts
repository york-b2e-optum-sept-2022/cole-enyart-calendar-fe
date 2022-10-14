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

  _eventList: IUser[] = [];
  user!: IUser;
  $user = new Subject<IUser[]>();
  // $user = new BehaviorSubject<IUser | null>( null);
  $event = new BehaviorSubject<IEvent | null>(null);
  $eventList = new BehaviorSubject<IEvent[]>([]);

  $inviteUser = new BehaviorSubject<IUser[] | null>(null);
  $eventInviteList = new BehaviorSubject<IEvent[]>([]);
  $eventListError = new BehaviorSubject<string | null>(null);

  private readonly EVENT_LIST_HTTP_ERROR = 'Unable to get the list of events, please try again later';

  onDestroy = new Subject();

  constructor(private httpService: HttpService, private userService: UserService) {

    this.userService.$user.pipe(takeUntil(this.onDestroy)).subscribe((user) => {
      if (user === null) {
        return;
      }
      this.user = user;
      this.$eventList.next(user.eventList);
      this.$eventInviteList.next(user.inviteList);
      this.sort(user);
    })

  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  addEventToUser(form: IEvent) {
    console.log("add clicked", form);

    const event = this.$eventList.getValue();
    form.id = uuidv4();
    event.push(form);

    const user: IUser = {
      id: this.user.id,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: this.user.password,
      eventList: event,
      inviteList: this.user.inviteList,
    }

    this.saveUser(user);
  }

  addInviteToUser(form: IEvent) {
    this.httpService.findUsersByEmail(form.invite).pipe(first()).subscribe({
      next: (userList) => {

        // validate password
        const foundAccount = userList.find(
          account => account.email === form.invite
        );
        if (!foundAccount) {
          // this.$loginError.next(this.LOGIN_INVALID_CREDENTIALS);
          return;
        }

        const invite = foundAccount.inviteList;
        invite.push(form);

        const user: IUser = {
          id: foundAccount.id,
          email: foundAccount.email,
          firstName: foundAccount.firstName,
          lastName: foundAccount.lastName,
          password: foundAccount.password,
          eventList: foundAccount.eventList,
          inviteList: invite,
        }

        this.httpService.updateUser(user).pipe(first()).subscribe({
          next: (user) => {
            this.$inviteUser.next(user);
          },
          error: (err) => {
            console.error(err);
          }
        })

        this.sort(user);
      },
      error: (err) => {
        console.error(err);
        // this.$loginError.next(this.LOGIN_HTTP_ERROR_MESSAGE)
      }
    });
  }

  viewEvent(event: IEvent) {
    if (this.$event !== null) {
      this.$event.next(event);
    }
  }

  removeEventFromUser(event: IEvent) {
    console.log("remove clicked", event);

    const user = this.user;

    const eventIndex = user.eventList.findIndex(eventItem => eventItem.id === event.id);

    user.eventList.splice(eventIndex, 1);
    console.log(user.eventList);

    this.saveUser(user);
  }

  updateEventForUser(oldEvent: IEvent, newEvent: IEvent) {
    console.log("edit clicked", oldEvent, newEvent);

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
  }

  saveUser(user: IUser) {
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
    const mapEvents = user.eventList.map((obj) => {
      return {...obj, dp: new Date(obj.dp)};
    })
    const sortedAscEvents = mapEvents.sort((objA, objB) => objA.dp.getTime() - objB.dp.getTime());

    this.$eventList.next(sortedAscEvents);

    const mapInvites = user.inviteList.map((obj) => {
      return {...obj, dp: new Date(obj.dp)};
    })
    const sortedAscInvites = mapInvites.sort((objA, objB) => objA.dp.getTime() - objB.dp.getTime());

    this.$eventInviteList.next(sortedAscInvites);
  }

  // onSearchTextChange(searchText: string) {
  //   this.$eventList.next(
  //     this._eventList.filter(event => event.name.toUpperCase().includes(searchText.toUpperCase()))
  //   );
  // }


}
