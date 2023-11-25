import {Component, inject, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {RouterOutlet} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ManagementUsersService} from "../../services/management-users.service";
import {HttpClient, HttpClientModule, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrModule, ToastrService} from 'ngx-toastr';

export interface TableItem {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
}

const ELEMENT_DATA: any = [];


@Component({
  selector: 'app-management-users',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    ManagementUsersComponent,
    ReactiveFormsModule, ToastrModule],
  templateUrl: './management-users.component.html',
  styleUrl: './management-users.component.sass'
})

export class ManagementUsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  private modalRef: NgbModalRef | undefined;

  idUserSelected: number = 0;
  httpClient = inject(HttpClient);
  totalDataSource = 0
  displayedColumns: string[] = ['Usuario', 'Nombres', 'Apellidos', 'Departamento', ' Cargo', 'Email', 'Acciones'];
  dataSource = ELEMENT_DATA;
  departments: any = [];
  positions: any = [];
  filters: any = {per_page: 10, page: 0}
  pageActually = 0
  userForm: FormGroup;
  modalService = inject(NgbModal);
  submitted: boolean = false;
  loading: boolean=false;
  apiUrl = 'http://127.0.0.1:8000/api/'; // Reemplaza con tu URL de la API


  constructor(private _formBuilder: FormBuilder) {
    this.userForm = this._formBuilder.group({
      departmentId: ['', [Validators.required]],
      positionId: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      secondName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      secondLastName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.loadData();
  }

  loadData() {
    this.loadDataDepartments()
    this.loadDataPositions()
    this.loadDataUsers()
  }

  loadDataUsers(): void {

    this.getAll(this.filters).subscribe(async (data: any) => {
      this.dataSource = await data.data
      this.totalDataSource = data.meta.total
    });
  }

  loadDataDepartments(): void {

    this.getAllDepartments(this.filters).subscribe(async (data: any) => {
      this.departments = await data.data
    });
  }

  loadDataPositions(): void {

    this.getAllPositions(this.filters).subscribe(async (data: any) => {
      this.positions = await data.data
    });
  }

  handlePage(event: PageEvent) {
    this.filters.per_page = event.pageSize
    this.pageActually = event.pageIndex
    this.filters.page = this.pageActually + 1;
    this.loadDataUsers();
  }

  getAll(options?: any): Observable<any> {
    const params = new HttpParams({fromObject: options});
    return this.httpClient.get(`${this.apiUrl}customUser`, {params})
  }

  deleteByUser(idUser?: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}customUser/${idUser}`,)
  }


  getAllDepartments(options?: any): Observable<any> {

    const params = new HttpParams({fromObject: options});
    return this.httpClient.get(`${this.apiUrl}departments`, {params})
  }

  getAllPositions(options?: any): Observable<any> {

    const params = new HttpParams({fromObject: options});
    return this.httpClient.get(`${this.apiUrl}positions`, {params})
  }


  open(content: TemplateRef<any>, idUser?: number) {
    console.log('tomo', idUser)
    this.idUserSelected = idUser ? idUser : 0
    this.modalRef = this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});

  }


  changeSelect(event: any, attribute: string) {
    if (event.target.value) {
      this.filters[attribute] = event.target.value
    } else {
      delete this.filters[attribute]
    }
    this.loadDataUsers()
    console.log('es...', this.filters)
  }

  deleteUser(content: any) {
    this.deleteByUser(this.idUserSelected).subscribe(async (data: any) => {
      console.log('elimino')
      this.loadDataUsers()
      this.closeModal()
      // TODO TOAS
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  get formControls() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log('ingreso')
    // stop here if form is invalid
    if (this.userForm.invalid) {
      console.log('no valido ', this.userForm)


      // this.toastr.warning('Al parecer existe un error con la información que ingresó, por favor revise y vuelva a intentar.',
      //   'Alerta');
      return;
    }
    this.loading = true;
  }
}
