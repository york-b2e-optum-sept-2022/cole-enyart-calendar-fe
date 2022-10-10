import {IEvent} from "./IEvent";
import {IInvite} from "./IInvite";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  eventList: IEvent[];
  inviteList: IInvite[];
}
