import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ShopService } from 'src/app/services/shop.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { finalize, map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface Category {
  type: string;
}

@Component({
  selector: 'app-dailog',
  templateUrl: './dailog.component.html',
  styleUrls: ['./dailog.component.css'],
})
export class DailogComponent implements OnInit {
  addOnBlur = true;
  shopForm: FormGroup;
  editMode = false;
  removable = true;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<unknown>;
  uploadProgress: Observable<unknown>;
  btnCurrentVal = 'Save';
  userName: any;
  userImage: any;
  uid;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private formbuilder: FormBuilder,
    private shopservice: ShopService,
    private dialogref: MatDialogRef<DailogComponent>,
    private afStorage: AngularFireStorage,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.userName = user.displayName;
        this.userImage = user.photoURL;
      }
    });
  }

  ngOnInit(): void {
    this.shopForm = this.formbuilder.group({
      uid: ['', Validators.required],
      shopName: ['', Validators.required],
      shopAddress: ['', Validators.required],
      shopImage: ['', Validators.required],
      shopNumber: ['', Validators.required],
      shopTimings: ['', Validators.required],
      shopCategory: [[], Validators.required],
      shopDescription: ['', Validators.required],
      userImage: ['', Validators.required],
      userName: ['', Validators.required],
    });

    if (this.editData) {
      this.editMode = true;
      this.btnCurrentVal = 'Update';
      this.shopForm.controls['userImage'].setValue(this.editData.userImage);
      this.shopForm.controls['userName'].setValue(this.editData.userName);
      this.shopForm.controls['uid'].setValue(this.editData.uid);
      this.shopForm.controls['shopName'].setValue(this.editData.shopName);
      this.shopForm.controls['shopAddress'].setValue(this.editData.shopAddress);
      this.shopForm.controls['shopImage'].setValue(this.editData.shopImage);
      this.shopForm.controls['shopNumber'].setValue(this.editData.shopNumber);
      this.shopForm.controls['shopTimings'].setValue(this.editData.shopTimings);
      this.shopForm.controls['shopCategory'].setValue(
        this.editData.shopCategory
      );
      this.shopForm.controls['shopDescription'].setValue(
        this.editData.shopDescription
      );
    }
  }

  get categories() {
    return this.shopForm.get('shopCategory');
  }

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    let filePath = id;
    this.ref = this.afStorage.ref(id);
    this.task = this.afStorage.upload(filePath, file);
    this.uploadState = this.task.snapshotChanges().pipe(map((s) => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe((url) => {
            this.shopForm.patchValue({
              shopImage: url,
              uid: this.uid,
              userName: this.userName,
              userImage: this.userImage,
            });
          });
        })
      )
      .subscribe();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our category
    if ((value || '').trim()) {
      this.categories.setValue([...this.categories.value, value.trim()]);
      this.categories.updateValueAndValidity();
    }
    if (input) {
      input.value = '';
    }
  }

  remove(category: Category): void {
    const index = this.categories.value.indexOf(category);

    if (index >= 0) {
      this.categories.value.splice(index, 1);
      this.categories.updateValueAndValidity();
    }
  }

  addShop() {
    if (this.shopForm.invalid) {
      return;
    } else {
      if (!this.editData) {
        this.shopservice.saveShop(this.shopForm.value).subscribe((res) => {
          alert('Post saved successfully');
          this.shopForm.reset();
          this.dialogref.close('save');
        }),
          (error) => {
            alert('Your post did not saved successfully');
          };
      } else {
        this.updateShop();
      }
    }
  }

  updateShop() {
    this.shopservice
      .updateShop(this.shopForm.value, this.editData.id)
      .subscribe((res) => {
        alert('Data updated successfully!');
        this.shopForm.reset();
        this.dialogref.close('Update');
      }),
      (error) => {
        alert('Could not update data');
      };
  }
}
