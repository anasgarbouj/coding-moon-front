import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leader-dialog',
  templateUrl: './leader-dialog.component.html',
  styleUrls: ['./leader-dialog.component.css']
})
export class LeaderDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LeaderDialogComponent>) {}

  ngOnInit(): void {
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
