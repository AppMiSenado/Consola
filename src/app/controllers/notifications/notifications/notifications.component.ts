import { NotifyService } from './../../../services/notify.service';
import { EndPointsService } from 'app/services/endpoints.service';
import { DataFake } from './dataFake';
import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { Controller } from 'app/controllers/controller.component';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends Controller implements OnInit {
  private chart: AmChart;

  notifications: any[];
  notificacionsArchived: any[];
  notificationSelected: any;

  public inbox: any = [];
  public storage: any = [];

  searchInbox: string;
  searchStorage: string;

  public colors: Array<string> = [
    '#009432',
    '#EA2027',
    '#7f8c8d',
    '#555555',
    '#FF0000',
    '#33FF00',
    '#CC00FF'];

  notificationDetail: any;

  loading: boolean = false;
  loading2: boolean = false;

  notificationsToStorage: any[] = [];

  last_page: number;
  page: number = 1;

  constructor(public df: DataFake,
    private AmCharts: AmChartsService,
    public el: ElementRef,
    public _endPointsService: EndPointsService,
    public _notifyService: NotifyService) {

    super(el)
    moment.locale('es');
  }

  ngOnInit() {
    // this.notifications = this.df.notificaciones;
    this.notificacionsArchived = this.df.notificacionesArchived;
    this.getNotifications(1)


  }


  getNotifications(page) {
    this.loading = true;
    this._endPointsService.apiGet(`notifications?page=${page}&number=20`)
      .subscribe(response => {
        this.loading = false;
        // console.log(response)

        if (!this.notifications) {
          this.notifications = response.data;
        } else {
          response.data.forEach(p => {
            this.notifications.push(p)
          });
        }

        this.last_page = response.last_page;

        if (this.notifications) {
          for (let n of this.notifications) {
            if (n.archived == 0) {
              if (!this.objectFindByKeyBoolean(this.inbox, 'id', n.id)) {
                this.inbox.push(n)
              }

            } else {
              this.storage.push(n)
            }
          }
        }
        // console.log(this.inbox)
        // console.log(this.storage)
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })
  }

  onScrollDown() {
    if (this.notifications) {
      if (this.page <= this.last_page) {
        this.page++
        this.getNotifications(this.page)
      } else {
        return
      }
    }
  }


  getNotificationDetail() {
    this.notificationDetail = undefined;
    this.loading2 = true;
    this._endPointsService.apiGet('notifications/' + this.notificationSelected.id)
      .subscribe(response => {
        this.loading2 = false;
        this.notificationDetail = response;
        setTimeout(() => {
          this.darwChart(this.notificationDetail.status);
        }, 300)
      }, error => {
        this.loading2 = false;
        this._notifyService.error(error)
      })
  }

  storageNotifications(notification) {
    if (!this.objectFindByKeyBoolean(this.notificationsToStorage, "id", notification.id)) {
      this.notificationsToStorage.push(notification)
    } else {
      this.removeFromArray(this.notificationsToStorage, notification.id)
    }


    // console.log(this.notificationsToStorage)
  }


  darwChart(e) {
    let payload = [
      {
        type: "Entregados",
        value: e.delivery.delivered
      },
      {
        type: "Invalidos",
        value: e.delivery.invalid
      },
      {
        type: "Pendientes",
        value: e.delivery.pending
      },
      {
        type: "Rechazados",
        value: e.delivery.unreachable
      }
    ]

    let payload2 = [
      {
        type: "Clickados",
        value: e.convertion.clicked
      },
      {
        type: "No Clickados",
        value: e.convertion.noclicked
      }
    ]

    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "theme": "light",
      "labelsEnabled": false,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "value",
      "titleField": "type",
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "legend": {
        "equalWidths": true,
        "periodValueText": "total: [[value.sum]]",
        "position": "bottom",
        "valueAlign": "center"
      },
      "fontSize": 11,
      "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
      "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payload
    });


    this.chart = this.AmCharts.makeChart("chartdiv2", {
      "type": "pie",
      "theme": "light",
      "labelsEnabled": false,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "value",
      "titleField": "type",
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "legend": {
        "equalWidths": true,
        "periodValueText": "total: [[value.sum]]",
        "position": "bottom",
        "valueAlign": "center"
      },
      "fontSize": 11,
      "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
      "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payload2
    });

  }

  archiveNotification() {
    let id: any[] = [];

    for (let n of this.notificationsToStorage) {
      id.push(n.id)
    }
    this.notifications = undefined;
    this.inbox = [];
    this.storage = [];
    // console.log(this.notifications)
    this.loading = true;

    this._endPointsService.apiPost("notifications/archived", { ids: id })
      .subscribe(response => {
        this.loading = false;
        this.notificationsToStorage = [];

        this.getNotifications(1);
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })

    // console.log(id)

  }


  searchInboxNotifications() {
    if (this.searchInbox) {
      this._endPointsService.apiGet(`search/notifications?keyword=${this.searchInbox}&page=1&number=20`)
        .subscribe(response => {
          console.log(response)
          this.notifications= []
          this.inbox = []
          this.storage = []
          this.notifications = response.data;
          if (this.notifications) {
            for (let n of this.notifications) {
              if (n.archived == 0) {
                if (!this.objectFindByKeyBoolean(this.inbox, 'id', n.id)) {
                  this.inbox.push(n)
                }
              } else {
                this.storage.push(n)
              }
            }
          }
        }, error => {
          this._notifyService.error(error)
        })
    } else {
      this.notifications = undefined;
      this.getNotifications(1);
    }
    // console.log("aca", this.searchInbox)
    // if (this.searchInbox) {
    //   this.inbox = this.objectFindByKey(this.inbox, "notification", "title", this.searchInbox);
    // } else {
    //   this.getNotifications(1);
    // }
  }

  searchInboxNotificationsStorage() {
    if (this.searchStorage) {
      this._endPointsService.apiGet(`search/notifications?keyword=${this.searchStorage}&page=1&number=20`)
        .subscribe(response => {
          console.log(response)
          this.notifications= []
          this.notifications = response.data;
          if (this.notifications) {
            for (let n of this.notifications) {
              if (n.archived == 0) {
                if (!this.objectFindByKeyBoolean(this.inbox, 'id', n.id)) {
                  this.inbox.push(n)
                }

              } else {
                this.storage.push(n)
              }
            }
          }
        }, error => {
          this._notifyService.error(error)
        })
    } else {
      this.notifications = undefined;
      this.getNotifications(1);
    }

    // console.log("aca", this.searchInbox)
    // if (this.searchStorage) {
    //   this.storage = this.objectFindByKey(this.storage, "notification", "title", this.searchStorage);
    // } else {
    //   this.getNotifications(1);
    // }
  }


  removeFromArray(array, idx) {
    const objIndex = array.findIndex(o => {
      //console.log(o.id, idx)
      o.id === idx;
    })

    //console.log(objIndex)
    if (objIndex == -1) {
      array.splice(objIndex, 1)
      //console.log(array)
      return array;
    }
  }

  objectFindByKeyBoolean(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return true;
      }
    }
    return false;
  }

  objectFindByKey(array, key1, key2, value) {
    let res = []
    for (var i = 0; i < array.length; i++) {
      console.log(array[i][key1][key2])
      // if (array[i][key].includes(value)) {
      if (array[i][key1][key2].indexOf(value) != -1) {
        res.push(array[i])
        //console.log(array[i])
      }
    }

    if (res.length != 0) {
      return res
    } else {
      return res
    }

  }

  resend(n) {
    this._endPointsService.apiPut('notifications/clone/' + n, {})
      .subscribe(response => {
        this._notifyService.success("Notificación enviada con éxito");
      }, error => {
        this._notifyService.error(error)
      })
  }

}
