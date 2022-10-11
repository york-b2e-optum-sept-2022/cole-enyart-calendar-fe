import {IEvent} from "./IEvent";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  eventList: IEvent[];
  inviteList: IEvent[];
}
