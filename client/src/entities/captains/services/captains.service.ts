import { Injectable, Signal, computed, signal } from '@angular/core';
import { getCaptainsListMock } from '../api/get-captains';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TCaptain, TCaptainSelected } from '../types';
import { TEAMS } from '../constants';

@Injectable()
export class CaptainsService {
  private readonly useMock = true;
  async getCaptains() {
    return this.useMock ? await getCaptainsListMock() : [];
  }

  // players$ = signal<TCaptain[]>([]);
  // // players = new BehaviorSubject<TCaptain[]>([]);
  // // players$ = new Subject<TCaptain[]>([]);

  // choosenCaptains_s$ = signal<TCaptainSelected[]>([]);
  // availableTeams$ = computed(() => {
  //   console.log(TEAMS, this.choosenCaptains_s$());
  //   return TEAMS.filter(
  //     (team) =>
  //       !this.choosenCaptains_s$()
  //         .map(({ team }) => team)
  //         .includes(team)
  //   );
  // });

  // captains$ = computed(() => {
  //   return this.players$().filter(({ captain }) => captain);
  // });

  // captainsToAdd$ = computed(() => {
  //   return this.players$().filter(
  //     ({ id }) => !this.captains$().find((captain) => captain.id === id)
  //   );
  // });

  // constructor() {
  //   this.init();
  // }

  // init() {
  //   this.getCaptains();
  // }

  // async getCaptains___() {
  //   const captains = await getCaptainsListMock();
  //   console.log(captains);
  //   if (captains?.length) {
  //     this.players$.update((prev) => [...prev, ...captains]);
  //     console.log('mutated');
  //   }
  //   console.log(this.players$());
  // }

  // toggleChoosenCaptains(id: string, team: string) {
  //   const hasCaptain = this.choosenCaptains_s$().find(
  //     (captain) => captain.id === id
  //   );

  //   if (hasCaptain) {
  //     this.choosenCaptains_s$.mutate((prev) =>
  //       prev.filter((captain) => captain.id !== id)
  //     );
  //   } else {
  //     const find = this.players$().find((captain) => captain.id === id);

  //     find &&
  //       this.choosenCaptains_s$.update((prev) => [...prev, { ...find, team }]);
  //   }
  // }

  // removeCaptain(id: string) {
  //   this.choosenCaptains_s$.update((prev) =>
  //     prev.filter((captain) => captain.id !== id)
  //   );
  // }

  // addCaptain(id: string) {
  //   this.players$.update((prev) =>
  //     prev.map((captain) => {
  //       if (captain.id === id) {
  //         return {
  //           ...captain,
  //           captain: true,
  //         };
  //       }
  //       return captain;
  //     })
  //   );
  // }
}
