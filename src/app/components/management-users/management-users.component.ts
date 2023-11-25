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
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  imports: [CommonModule, HttpClientModule, RouterOutlet, MatFormFieldModule, MatInputModule, MatTabsModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, ManagementUsersComponent],
  templateUrl: './management-users.component.html',
  styleUrl: './management-users.component.sass'
})

export class ManagementUsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;


  httpClient = inject(HttpClient);
  totalDataSource = 0
  displayedColumns: string[] = ['Usuario', 'Nombres', 'Apellidos', 'Departamento', ' Cargo', 'Email', 'Acciones'];
  dataSource = ELEMENT_DATA;
  departments: any = [];
  positions: any = [];
  filters: any = {per_page: 10, page: 0}
  pageActually = 0
  closeResult = '';
  private modalService = inject(NgbModal);
  private apiUrl = 'http://127.0.0.1:8000/api/'; // Reemplaza con tu URL de la API

  constructor() {
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

  getAllDepartments(options?: any): Observable<any> {

    const params = new HttpParams({fromObject: options});
    return this.httpClient.get(`${this.apiUrl}departments`, {params})
  }

  getAllPositions(options?: any): Observable<any> {

    const params = new HttpParams({fromObject: options});
    return this.httpClient.get(`${this.apiUrl}positions`, {params})
  }


  open(content: TemplateRef<any>) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
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
}
