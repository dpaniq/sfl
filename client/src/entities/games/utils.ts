import { TPlayerStatisticFinal } from './types';

export function isPlayerStatisticTransferable(
  id: string,
  players: TPlayerStatisticFinal[],
) {
  return players.filter(player => player.playerId === id).length == 2;
}
