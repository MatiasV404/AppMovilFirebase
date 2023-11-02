import { Component, Input, OnInit, inject} from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  // Creamos un código reutilizable
  @Input() title!:string;
  @Input() backButton!:string;
  @Input() isModal!:boolean;

  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  dismissModal(){
    this.utilsSvc.dismissModal();
  }

}
