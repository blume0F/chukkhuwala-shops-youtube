import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Shop } from '../model/shop';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  uid: any;
  constructor(private http: HttpClient, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  saveShop(data: any) {
    return this.http.post<any>(
      'https://chukkhuwala-final-default-rtdb.asia-southeast1.firebasedatabase.app/shopList.json',
      data
    );
  }

  getShop() {
    return this.http
      .get<{ [id: string]: Shop }>(
        'https://chukkhuwala-final-default-rtdb.asia-southeast1.firebasedatabase.app/shopList.json'
      )
      .pipe(
        map((posts) => {
          let shopsData: Shop[] = [];
          for (let id in posts) {
            shopsData.push({ ...posts[id], id });
          }
          return shopsData;
        })
      );
  }

  updateShop(data: any, id: number) {
    return this.http.put(
      'https://chukkhuwala-final-default-rtdb.asia-southeast1.firebasedatabase.app/shopList/' +
        id +
        '.json',
      data
    );
  }

  deleteShop(id: number) {
    return this.http.delete<any>(
      'https://chukkhuwala-final-default-rtdb.asia-southeast1.firebasedatabase.app/shopList/' +
        id +
        '.json'
    );
  }

  getUserShops() {
    return this.http
      .get<{ [id: string]: Shop }>(
        'https://chukkhuwala-final-default-rtdb.asia-southeast1.firebasedatabase.app/shopList.json'
      )
      .pipe(
        map((posts) => {
          let shopsData: Shop[] = [];
          for (let id in posts) {
            shopsData.push({ ...posts[id], id });
          }
          let result: Shop[] = [];
          result = shopsData.filter((data) => data.uid == this.uid);
          return result;
        })
      );
  }
}
