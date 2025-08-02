export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  event_time: Date;
  location: string;
  capacity: number;
}
