import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery: any;

@Component({
  selector: 'app-senators',
  templateUrl: './senators.component.html',
  styleUrls: ['./senators.component.scss']
})
export class SenatorsComponent extends Controller implements OnInit {

  private senators: Array<any> = [];
  private senator: any;
  private senator_id: number;
  private filtered: string = '';
  private loading: boolean = false;
  last_page: number;
  page: number = 1;

  ngOnInit() {
    this.getSenators(1)
  }

  update(senator_id) {
    let senator = this.senators.filter(senator => senator.id === senator_id);
    this.senator = senator[0];
    console.log(this.senator)
    this.fadeIn('senator');
  }

  store(payload) {

    let senatorComponent = this;

    payload.birthdate = this.moment(payload.birthdate).format('YYYY-MM-DD');

    if (!payload.id) {
      payload.password = Math.random().toString(36).slice(-8);
    }
    
    if(payload.id && !payload.password){
      payload.password = Math.random().toString(36).slice(-8);
    }

    this.isRegistered(payload.email, payload.password)
      .then(firebase_id => {
        payload.firebase_id = firebase_id;

        if (!payload.id) {
          senatorComponent.endpoint.apiPost('senators', payload).subscribe(
            response => {
              senatorComponent.ngOnInit();
              senatorComponent.notify.success('Se ha creado correctamente el senador');
            },
            error => senatorComponent.notify.error(error),
          );
        } else {
          senatorComponent.endpoint.apiPut('senators/' + payload.id, payload).subscribe(
            response => {
              senatorComponent.ngOnInit();
              senatorComponent.notify.success('Se ha modificado correctamente el senador');
            },
            error => {
              console.log(error)
              senatorComponent.notify.error(error)
            },
          );
        }

      })
      .catch(error => {
        console.log(error)
        senatorComponent.notify.error(error)
      });

    this.fadeOut('senator');
  }

  /**
   * isRegistered verifica si el senador está registrado en el sistema
   * @param string email 
   * @param string password
   * @return Promise
   */
  isRegistered(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.oauth.auth.signInWithEmailAndPassword(email, password)
        .then(user => resolve(user.uid))
        .catch(() => {
          this.emailSignUp(email, password)
            .then(firebase_id => resolve(firebase_id))
            .catch(error => reject(error));
        });
    });
  }

  /**
   * emailSignUp registra al senador en el sistema
   * @param string email 
   * @param string password
   * @return Promise
   */
  emailSignUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.oauth.auth.createUserWithEmailAndPassword(email, password)
        .then(user => resolve(user.uid))
        .catch(error => reject(error));
    });
  }

  delete() {
    this.endpoint.apiDelete('senators/' + this.senator_id).subscribe(
      response => {
        this.ngOnInit();
        this.notify.success('Se ha eliminado correctamente el senador');
      },
      error => this.notify.error(error),
    );

    jQuery("#modal-delete").modal("hide");
  }

  getSenators(page) {
    this.loading = true;
    this.endpoint.apiGet(`senators?page=${page}&number=20`).subscribe(
      response => {
        this.loading = false;
        if (!this.senators) {
          this.senators = response.data;
        } else {
          if (response.data) {
            response.data.forEach(p => {
              this.senators.push(p)
            });

          }
        }
        this.last_page = response.last_page;
      },
      error => {
        this.notify.error(error)
        this.loading = false;
      },
    );
  }


  onScrollDown() {
    if (this.senators) {
      if (this.page < this.last_page) {
        this.page++
        this.getSenators(this.page)

      } else {
        return
      }
    }
  }

  search(){    

    if(this.filtered.length !=0){
      this.endpoint.apiGet(`search/senators?keyword=${this.filtered}&page=1&number=15`)
      .subscribe(response=>{
    
        this.senators = response.data;
      }, error=>{
        this.notify.error(error)
      })
      // this.projects = this.objectFindByKey(this.projects, "name", "description", this.filter.title);
    }else{
      this.senators = undefined;
      this.getSenators(1)
    }
  }


}
