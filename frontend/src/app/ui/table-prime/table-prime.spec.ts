import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePrime } from './table-prime';

describe('TablePrime', () => {
  let component: TablePrime;
  let fixture: ComponentFixture<TablePrime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePrime],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePrime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
