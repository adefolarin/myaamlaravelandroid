import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
 
import { IonicModule } from '@ionic/angular';


import { BiblesComponent } from '../bibles/bibles.component';

@NgModule({
  imports: [],
  exports: [
    BiblesComponent,
  ],
  declarations: [BiblesComponent]
})
export class BiblesModule {}
