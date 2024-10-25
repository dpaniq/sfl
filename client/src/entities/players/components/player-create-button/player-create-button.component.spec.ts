import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCreateButtonComponent } from './player-create-button.component';

describe('PlayerCreateButtonComponent', () => {
  let component: PlayerCreateButtonComponent;
  let fixture: ComponentFixture<PlayerCreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCreateButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerCreateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
