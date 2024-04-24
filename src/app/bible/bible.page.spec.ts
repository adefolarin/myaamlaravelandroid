import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BiblePage } from './bible.page';

describe('BiblePage', () => {
  let component: BiblePage;
  let fixture: ComponentFixture<BiblePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BiblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
