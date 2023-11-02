import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  // Creamos un código reutilizable
  @Input() title!:string;
  @Input() backButton!:string;


  constructor() { }

  ngOnInit() {}

}
