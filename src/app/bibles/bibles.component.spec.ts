import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BiblesComponent } from './bibles.component';

describe('BiblesComponent', () => {
  let component: BiblesComponent;
  let fixture: ComponentFixture<BiblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
