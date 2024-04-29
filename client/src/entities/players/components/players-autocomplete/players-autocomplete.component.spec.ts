import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersAutocompleteComponent } from './players-autocomplete.component';

describe('PlayersAutocompleteComponent', () => {
  let component: PlayersAutocompleteComponent;
  let fixture: ComponentFixture<PlayersAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayersAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
