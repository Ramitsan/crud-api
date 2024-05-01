interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

interface IRequestOptions {
  url: string;
  body?: any;
  method?: string;
}

export { IUser, IRequestOptions };