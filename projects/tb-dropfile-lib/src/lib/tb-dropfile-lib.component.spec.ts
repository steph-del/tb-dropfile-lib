import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbDropfileLibComponent } from './tb-dropfile-lib.component';

describe('TbDropfileLibComponent', () => {
  let component: TbDropfileLibComponent;
  let fixture: ComponentFixture<TbDropfileLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbDropfileLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbDropfileLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
