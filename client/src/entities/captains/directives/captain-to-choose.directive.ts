import { Directive, ElementRef, HostListener } from '@angular/core';
import { CaptainsService } from '../services/captains.service';

@Directive({
  selector: 'sfl-captains-cards[captainToChoose]',
  standalone: true,
  providers: [CaptainsService],
})
export class CaptainToChooseDirective {
  @HostListener('mouseover')
  onMouseOver() {
    this.el.nativeElement.style.boxShadow = '1px 1px 5px 2px black';
  }

  @HostListener('mouseout')
  onMouseOut() {
    this.el.nativeElement.style.boxShadow = 'none';
  }

  @HostListener('click')
  onChoose() {
    const card = this.el.nativeElement.querySelector('mat-card');
    if (card) {
      const dataCaptain = card.getAttribute('data-captain');
      console.log(dataCaptain);
    }
  }

  constructor(
    private el: ElementRef<HTMLElement>,
    private captainsService: CaptainsService
  ) {
    this.el.nativeElement.style.cursor = 'pointer';
  }
}
