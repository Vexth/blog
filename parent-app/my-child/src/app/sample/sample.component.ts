import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-sample',
  template: `
  <div style="border: blue solid 1px">
    <p>Data from Parent: {{dataFromParent}}</p>
    <input [(ngModel)]="input" [value]="input" (keydown.enter)="send()">
  </div>
  `,
  styles: []
})
export class SampleComponent implements OnChanges, OnInit {
  @Input() dataFromParent: string = "";
  @Output() emitDataToParent = new EventEmitter<string>();
  input: string = "";
  ifLoaded = false;
  constructor() { }

  send() {
    this.emitDataToParent.emit(this.input);
    this.input = '';
  }

  ngOnInit(): void {
    if (this.ifLoaded) {
      // this code is only going to be run once
      console.log(this.dataFromParent);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.ifLoaded) {
      this.ifLoaded = true;
      this.ngOnInit();
    }
    // any code that needs to be run every time a change is made
  }
}
