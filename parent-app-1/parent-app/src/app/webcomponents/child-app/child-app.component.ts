import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-child',
  template: `<micro-child *axLazyElement="link" (emitDataToParent)="dataToParent($event)" [dataFromParent]="dataToChild"></micro-child>`,
  styles: []
})
export class ChildAppComponent implements OnInit {
  link: string = 'http://localhost:8084/main.js'

  @Input() dataToChild: string = "主服务传递到子子服务的数据";
  @Output() dataFromChild = new EventEmitter<string>()
  listOfData: string[] = [];

  constructor() { }

  dataToParent($event: any) {
    console.log($event)
    alert("由子服务转递过来的数据：" + $event.detail)
    this.dataFromChild.emit($event.detail);
  }

  ngOnInit(): void {
  }

}
