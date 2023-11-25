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
import {HttpClient, HttpClientModule} from "@angular/common/http";

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

  @Input() dato: number | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  pageSize = 5;
  pageIndex = 0;
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', ' departmentId', 'positionId', 'column7'];
  dataSource = ELEMENT_DATA;

  constructor() {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.httpClient.get('http://127.0.0.1:8000/api/customUser?per_page=2').subscribe(async (data: any) => {
      this.dataSource = await data.data
      console.log('llega--',this.dataSource);
    });
  }

  handlePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Puedes cargar los datos correspondientes a la nueva página aquí
  }
}
