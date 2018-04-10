import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery:any;

@Component({
  selector: 'app-dashboard-comision',
  templateUrl: './dashboard-comision.component.html',
  styleUrls: ['./dashboard-comision.component.scss']
})
export class DashboardComisionComponent extends Controller implements OnInit {

  private commissions:Array<any> = [];
  private commission:any;
  private session_id:number;
  private filtered:string = "";

  private comments:any = {
    'new'       : [],
    'allowed'   : [],
    'discarded' : [],
  };

  ngOnInit() {
    this.endpoint.apiGet('commissions').subscribe(
      response => {
        this.commissions = response

        this.commissions.forEach( commission => {

          /**
           * Conecta con firebase para leer los comentarios
           */
          if(commission.session_id !== false){
            let commission_path = 'commissions/' + commission.firebase_id + '/comments';
            this.firebase.object( commission_path ).snapshotChanges()
              .subscribe(() => {
                this.firebase.object( commission_path ).valueChanges()
                  .subscribe( comments => {

                    if( comments !== null ){

                      Object.keys(comments).forEach(index => {

                        let section = 'new';
                        if( comments[index].status === true ){
                           section = 'allowed';
                        } else if( comments[index].status === false ){
                           section = 'discarded';
                        }

                        let comment_exists = this.comments[section].filter(comment => {
                            if(comment.commission_id === commission.firebase_id && comment.comment_id === index){
                              return true;
                            }
                          });

                        if(comment_exists.length === 0){
                          this.comments[section].push({
                            'citizen'         : comments[index].citizen,
                            'email'           : comments[index].email,
                            'human_date'      : this.moment.unix( comments[index].date / 1000 ).fromNow(),
                            'message'         : comments[index].message,
                            'commission_name' : commission.name,
                            'comment_id'      : index,
                            'commission_id'   : commission.firebase_id,
                          });
                        }

                      });
                    }
                  });
              });
          }

        });
      },
      error    => this.notify.error(error),
    );
  }

  status(index, e){
		e.target.checked = !e.target.checked;
		
		if(this.commissions[index].session_id === false){
			this.commission = this.commissions[index];
			this.fadeIn('session');
		} else {
      this.session_id = this.commissions[index].session_id;
      jQuery("#modal-close").modal("show");
    }
	}

  livestreaming(index){
    this.commission = this.commissions[index];
    this.fadeIn('session');
  }

	session(payload){
    if(payload.session_id){
      this.endpoint.apiPut('sessions/' + payload.session_id, {
        'commission_id': payload.commission_id,
        'livestreaming': payload.livestreaming,
      }).subscribe(
        response => this.ngOnInit(),
        error    => this.notify.error(error),
      );
    } else {
      this.endpoint.apiPost('sessions', {
        'commission_id': payload.commission_id,
        'livestreaming': payload.livestreaming,
      }).subscribe(
        response => this.ngOnInit(),
        error    => this.notify.error(error),
      );
    }
    
    this.fadeOut('session');
	}

  close(payload){
    this.endpoint.apiDelete('sessions/' + payload.session_id).subscribe(
        response => {
          this.comments = {
            'new'       : [],
            'allowed'   : [],
            'discarded' : [],
          };

          this.ngOnInit()
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-close").modal("hide");
  }

  validate( action, index, section ){
    let comment = this.comments[section][index];
    let path    = 'commissions/' + comment.commission_id + '/comments/' + comment.comment_id;
    this.firebase.object(path).update({'status':action});
    this.comments[section].splice(index, 1);
  }
}
