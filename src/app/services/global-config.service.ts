import { Injectable } from '@angular/core';
import { ConfigurationsApp } from 'config';


@Injectable()
export class GlobalConfigService {
  private APP_STATE:       string = "DEPLOY";
  private URL:   		       any = ConfigurationsApp.URL;                           
  public APP_KEY:          string = ConfigurationsApp.APP_KEY;
  private API_URL:         string = this.URL[this.APP_STATE];

  getApiUrl(complement){
    if (typeof complement == "undefined") {
      complement = "";
    }
    
  	return this.API_URL + complement;
  }

  constructor() {
  }

}
