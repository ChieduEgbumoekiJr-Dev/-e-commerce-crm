import { EventEmitter } from 'events';
import axios from 'axios';

export enum LogEventsType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ERROR = 'error',
  WATCH = 'watch',
}

const baseURL = 'http://localhost:3334';

export const axiosAnalytics = axios.create({
  baseURL: `${baseURL}/analytics`,
});

export class LogEvent extends EventEmitter {
  constructor() {
    super();
    this.receiveAllPreDefinedEvents();
  }

  emitPreDefinedEvent(eventName: LogEventsType, data) {
    this.emit(eventName, data);
  }

  loggingTemplate(
    action: LogEventsType,
    data: {
      id: string;
      description: string;
      payload: any;
      accessToken: string;
    }
  ) {
    const payload = {
      requestUserId: data.id,
      action: LogEventsType.WATCH,
      description: data.description,
      payload: JSON.stringify(data.payload),
    };
    axiosAnalytics
      .post('/', payload, {
        headers: { Authorization: 'Bearer' + data.accessToken },
      })
      .then(() => console.log('success'))
      .catch((e) => console.log('error:', e));
  }

  receiveAllPreDefinedEvents() {
    this.on(
      LogEventsType.CREATE,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.CREATE, data)
    );

    this.on(
      LogEventsType.UPDATE,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.UPDATE, data)
    );
    this.on(
      LogEventsType.DELETE,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.DELETE, data)
    );
    this.on(
      LogEventsType.LOGIN,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.LOGIN, data)
    );
    this.on(
      LogEventsType.LOGOUT,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.LOGOUT, data)
    );
    this.on(
      LogEventsType.ERROR,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.ERROR, data)
    );
    this.on(
      LogEventsType.WATCH,
      (data: {
        id: string;
        description: string;
        payload: any;
        accessToken: string;
      }) => this.loggingTemplate(LogEventsType.CREATE, data)
    );
  }
}
