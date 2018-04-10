import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { GlobalConfigService } from './global-config.service';
import { StorageService } from 'app/services/storage.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class EndPointsService {
  public headers: any;

  constructor(public _globalService: GlobalConfigService,
    public _storateService: StorageService,
    private http: Http) { }


  private getData(data: Response) {
    if (data.status === 204) {
      return [];
    }
    return data.json().response;
  }

  private getError(error: any) {

    if (error.json().error === 'token_expired') {
      return Observable.throw('Su sessión ha expirado');
    }

    if (error.status === 429) {
      return Observable.throw(error.statusText);
    }

    let msg = '';

    if (error.json().message) {
      if (typeof error.json().message === 'object') {
        Object.keys(error.json().message).forEach(key => {
          msg += key + ' (' + error.json().message[key][0] + ')<br>';
        });
      } else if (typeof error.json().message === 'string') {
        msg = error.json().message;
      }
    } else {
      msg = JSON.stringify(error.json());
    }

    return Observable.throw(msg);
  }

  private serialize(obj) {
    let str = [];
    for (let p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  private getHeaders() {
    if (this.headers !== undefined) {
      let headers = this.headers;
      return new RequestOptions({ 'headers': headers });
    } else {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'AppKey': this._globalService.APP_KEY,
        'Authorization': (window.sessionStorage.getItem('access_token')) ? 'Bearer ' + window.sessionStorage.getItem('access_token') : null
      });
      return new RequestOptions({ 'headers': headers });
    }
  }

  public setHeaders(headers) {
    headers.Authorization = (window.sessionStorage.getItem('access_token')) ? 'Bearer ' + window.sessionStorage.getItem('access_token') : null;
    this.headers = new Headers(headers);
  }

  apiGet(paramsUrl: string, data: any = null) {
    if (data !== null) {
      paramsUrl = paramsUrl + '?' + this.serialize(data);
    }

    return this.http.get(this._globalService.getApiUrl(paramsUrl), this.getHeaders())
      .map(this.getData)
      .catch(this.getError);
  }


  apiPost(paramsUrl: string, data: object) {
    return this.http.post(this._globalService.getApiUrl(paramsUrl), data, this.getHeaders())
      .map(this.getData)
      .catch(this.getError);
  }

  apiPut(paramsUrl: string, data: object){
    return this.http.put(this._globalService.getApiUrl(paramsUrl), data, this.getHeaders())
      .map(this.getData)
      .catch(this.getError);
  }

  apiDelete(paramsUrl: string){
    return this.http.delete(this._globalService.getApiUrl(paramsUrl), this.getHeaders())
      .map(this.getData)
      .catch(this.getError);
  }

}


