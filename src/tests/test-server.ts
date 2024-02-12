import { Readable} from 'stream';
import { IRequestOptions } from '../interfaces';

export class Request extends Readable {
  url: string;
  method: string;
  constructor(options: IRequestOptions) {
    super();
    this.url = options.url;
    this.method = options.method || 'GET';
    if(options.body) {
      this.push(JSON.stringify(options.body));
    }   
    this.push(null);
  }
}

export class Response {
  statusCode: number;
  _data: string;
  onEnd?: () => void;

  end(data: string) {
    this._data = data;
    this.onEnd?.();
  }
}