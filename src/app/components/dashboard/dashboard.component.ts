import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/model/shop';
import { ShopService } from 'src/app/services/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { DailogComponent } from '../dailog/dailog.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dataSource: MatTableDataSource<Shop>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  obs: Observable<any>;
  noShopEntries = false;
  uid: any;

  constructor(
    private shopservice: ShopService,
    public dialog: MatDialog,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) this.uid = user.uid;
    });
  }

  ngOnInit(): void {
    this.getAllShops();
  }

  getAllShops() {
    this.shopservice.getShop().subscribe(
      (res: any) => {
        if (res.length == 0) {
          this.noShopEntries = true;
        } else {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.obs = this.dataSource.connect();
        }
      },
      (error) => {
        alert('Some error while fetching data');
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editShop(shopData: any) {
    this.dialog
      .open(DailogComponent, {
        width: '100%',
        data: shopData,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Update') {
          this.getAllShops();
        }
      });
  }

  deleteShop(id: number) {
    if (confirm('Are you sure you want to delete this shop?')) {
      this.shopservice.deleteShop(id).subscribe((res) => {
        alert('Shop deleted successfully!');
        this.getAllShops();
      }),
        (error) => {
          alert('Shop could not be deleted');
        };
    }
  }
}
