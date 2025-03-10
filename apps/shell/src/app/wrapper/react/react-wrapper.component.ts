import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-react-wrapper',
  imports: [CommonModule],
  templateUrl: './react-wrapper.component.html',
  styleUrl: './react-wrapper.component.css',
})
export class ReactWrapperComponent implements AfterContentInit {
  
  @ViewChild('vc', { read: ElementRef, static: true }) vc!: ElementRef;
  constructor(private route: ActivatedRoute) {}

  async ngAfterContentInit(): Promise<void> {
    const elementName = this.route.snapshot.data['elementName'];
    const loader = this.route.snapshot.data['loadChildren'];
    await loader();
    console.log('elementName', elementName);
    const element = document.createElement(elementName);
    console.log('element', element);
    this.vc.nativeElement.appendChild(element);
  }
}
