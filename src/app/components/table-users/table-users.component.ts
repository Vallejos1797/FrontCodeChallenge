import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
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
  selector: 'app-table-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, MatFormFieldModule, MatInputModule, MatTabsModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, TableUsersComponent],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.sass'
})

export class TableUsersComponent implements OnInit {
  httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/'; // Reemplaza con tu URL de la API


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  totalDataSource = 0

  displayedColumns: string[] = ['Usuario', 'Nombres', 'Apellidos', 'Departamento', ' Cargo', 'Email', 'Acciones'];
  dataSource = ELEMENT_DATA;
  filters: any = {per_page: 10, page: 0}
  pageActually = 0

  constructor() {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.getAll(this.filters).subscribe(async (data: any) => {
      this.dataSource = await data.data
      this.totalDataSource = data.meta.total
    });
  }

  handlePage(event: PageEvent) {
    this.filters.per_page = event.pageSize
    this.pageActually = event.pageIndex
    this.filters.page = this.pageActually + 1;
    this.loadData();
  }

  getAll(options?: any): Observable<any> {
    const params = new HttpParams({fromObject: options});
    return this.httpClient.get(`${this.apiUrl}customUser`, {params})
  }
}
