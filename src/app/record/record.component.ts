import { Component, ViewChild, OnInit, TemplateRef } from "@angular/core";
import { AlertService, UserService } from "../_services";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from "../_models";
import { SimplePdfViewerComponent, SimplePDFBookmark } from "simple-pdf-viewer";
import { ActivatedRoute } from "@angular/router";
import {DomSanitizer} from '@angular/platform-browser';
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

import { BsModalService } from "ngx-bootstrap/modal/bs-modal.service";
import { throwError } from "rxjs/internal/observable/throwError";
declare var $ :any;

@Component({
    selector: 'record-root',
    templateUrl: './record.component.html',
    styleUrls:['./record.Component.css'],
    
})
export class recordComponent implements OnInit{
    modalRef: BsModalRef;
    fb: any;
    recordform: FormGroup;
    buttonColor: string  = '#fff'; 
    color: any;
    users: User[];
    addrecord: FormGroup;
    submitted = false;
    loading = false;
    showSelected: boolean;
    fileToUpload:File;
   user_Rec:any;
   
    ShowButton() {
        this.showSelected = true;
        console.log(this.showSelected);
    }
    HideButton() {
        this.showSelected = false;
        console.log(this.showSelected);   
    }

   
    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        public sanitizer: DomSanitizer    
    ){

        this.user_Rec={};
       this.showSelected=false;
       
        this.addrecord = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('',[Validators.required,Validators.email]),
        dob: new FormControl('', Validators.required),
        doj: new FormControl('', Validators.required),
        offergiven: new FormControl('', Validators.required),
        rod: new FormControl(),
        phone:new FormControl('',Validators.required),
        addemail:new FormControl('',Validators.required),
        dd:new FormControl(),
        fileName : new FormControl(),
        uploaddocs : new FormControl(),
        uploaddoc:new FormControl('', Validators.required),
        notification: new FormControl('accepted'),
     });
         
         this.route.params.subscribe(params => {

            console.log(params['id']);
           if(params['id']){
            this.userService.getById(params['id']).subscribe(user =>{
                this.user_Rec = user;
                this.addrecord.patchValue({
                    firstName : user['firstName'],
                    lastName : user['lastName'],
                    email:user['email'],
                    phone:user['phone'],
                    dob:user['dob'],
                    
                });
               
            });
           }
           
           
           
          });
          
    }
    openModal( url:string) {
        const initialState  ={
            src : url
        };
        this.modalRef = this.modalService.show(ModalContentComponent , {initialState});
      }
    formControlValueChanged() {
        const phoneControl = this.addrecord.get('rod');
        const phoneControl1 = this.addrecord.get('dd');
    this.addrecord.get('notification').valueChanges.subscribe(
        (mode: string) => {
            console.log(mode);
            if (mode === 'declined') {
                phoneControl.setValidators([Validators.required]),
                phoneControl1.setValidators([Validators.required]);
            }
            else if (mode === 'accepted') {
                phoneControl.clearValidators(),
                phoneControl1.clearValidators();
            }
            phoneControl.updateValueAndValidity(),
            phoneControl1.updateValueAndValidity();
        });
    }
    ngOnInit(){
        
     this.formControlValueChanged();
     $(function() {
        var loc = window.location.href; // returns the full URL
        if(/record/.test(loc)) {
          $('.headbar').addClass('tech');
        }
      });
    }

    get f() { return this.addrecord.controls; } 
        

    changeFile(files:FileList){
        //console.log(files.item(0));
        this.userService.uploadFile(files.item(0))
        .pipe(first())
        .subscribe(
            data => {
               
                 console.log(data['path']);
                 this.addrecord.patchValue({
                    fileName : data['path'],
                    
                 })
                
            },
            error => {
                this.alertService.error(error);
                
            });

    }

    changeFile1(files:FileList){
        console.log(files.item(0));
        this.userService.uploadFile(files.item(0))
        .pipe(first())
        .subscribe(
            data => {
               
                 console.log(data['path']);
                 this.addrecord.patchValue({
                    uploaddocs : data['path'],
                    
                 })
                
            },
            error => {
                this.alertService.error(error);
                
            });

    }

    success(message: string) { 
        this.alertService.success(message);
    }
error(message: string) {
        this.alertService.error(message);
    }
    onSubmit() {
        this.submitted = true;
         console.log(this.addrecord.value);
        // stop here if form is invalid
        if (this.addrecord.invalid) {
            this.error;
            return;
        }
    
        this.loading = true;
       

        this.userService.addrecord(this.addrecord.value)
        .pipe(first())
        .subscribe(
            users => {
               
                 console.log(users);
                this.users = users; 
                this.success;
            },
            error => {
                this.alertService.error(error);
                return throwError;
                
            });
            

        
}

@ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;
  bookmarks: SimplePDFBookmark[] = [];

  // how to open PDF document
  openDocument(document: File) {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      this.pdfViewer.openDocument(new Uint8Array(fileReader.result));
    };
    fileReader.readAsArrayBuffer(document);
  }

  // how to create bookmark
  createBookmark() {
    this.pdfViewer.createBookmark().then(bookmark => {
      if(bookmark) {
        this.bookmarks.push(bookmark);
      }
    })
  }
}



@Component({
    selector: 'modal-content',
    template: `
    <div class="modal-header">
    <h4 class="modal-title pull-left">Additional Email</h4>
     <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <section id="viewer" >
       
         <simple-pdf-viewer #pdfViewer [src]="src"></simple-pdf-viewer>
    </section>
    
    
   <button type="button" (click)="pdfViewer.zoomIn()">ZoomIn</button>
    <button type="button" (click)="pdfViewer.nextPage()">Next Page</button>
    <button type="button" (click)="pdfViewer.turnLeft()">Turn the document left</button>
    <button  type="button" (click)="pdfViewer.search('PDF')">Search the world 'PDF'</button> 
    
    <p>Number of pages: {{ pdfViewer.getNumberOfPages() }}</p>
    <p>Actual page: {{ pdfViewer.getCurrentPage() }}</p>
    <p>Zoom: {{ pdfViewer.getZoomPercent() }} %</p> 
  </div>
  <div class="modal-footer">
    
    </div>
    `
    
  })
   
  export class ModalContentComponent implements OnInit {
    modalRef: BsModalRef;
    src:string
    constructor(public bsModalRef: BsModalRef) {}
   
    ngOnInit() {
        //console.log(this.src);
    }
  }