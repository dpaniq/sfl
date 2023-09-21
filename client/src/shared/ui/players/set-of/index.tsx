import PlayerCards from '../cards';

import {Button, Box, Grid, Typography} from '@suid/material';
import {createSignal, For, Switch, Match, Show} from 'solid-js';
import PlayerCard from '../card';

import CapitansListJSON from '../../../shared/api/captains/mock/list.json';
import PlayersListJSON from '../../../shared/api/players/mock/list.json';

interface PropsInterface {
  onNextStage: () => any;
}

export default function SetOfPlayers({onNextStage}: PropsInterface) {
  const [canNextStage, setCanNextStage] = createSignal(false);

  const [players] = createSignal<IPlayer[]>([...PlayersListJSON]);

  const [playerA, setPlayerA] = createSignal<IPlayer | null>(null);
  const [playerB, setPlayerB] = createSignal<IPlayer | null>(null);

  const availablePlayers = () =>
    players().filter((player) => {
      return ![playerA()?.id, playerB()?.id].includes(player.id);
    });

  const addPlayer = (id, team) => {
    const player = players().find((player) => player.id === id);
    if (player) {
      switch (team) {
        case 'A':
          return setPlayerA((prev) => ({
            ...prev,
            ...player,
            team,
          }));
        case 'B':
          return setPlayerB({
            ...player,
            team,
          });
        default:
          return null;
      }
    }
  };

  return (
    <>
      <h1>II. Set of players</h1>
      <hr />

      <Box sx={{flexGrow: 1}}>
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
          <Grid item xs={6}>
            <h2>Choosen:</h2>
            <Switch fallback={'Please choose player below:'}>
              <Match when={playerA()}>
                <Typography component={'p'} textAlign="center">
                  Your choise is:
                </Typography>
                <PlayerCard player={playerA()}></PlayerCard>

                <Button onClick={() => setPlayerA(null)} variant="outlined">
                  Take off player
                </Button>
                <br />
                <hr />
              </Match>
            </Switch>

            <Show when={!playerA()}>
              <For each={availablePlayers()}>
                {(player) => (
                  <Box
                    sx={{flexGrow: 1, cursor: 'pointer'}}
                    onClick={() => addPlayer(player.id, 'A')}
                  >
                    <PlayerCard player={player} />
                  </Box>
                )}
              </For>
            </Show>
          </Grid>

          <Grid item xs={6} sx={{flexGrow: 1}}>
            <h2>Choosen:</h2>
            <Switch fallback={'Please choose player below:'}>
              <Match when={playerB()}>
                <Typography component={'p'} textAlign="center">
                  Your choise is:
                </Typography>
                <PlayerCard player={playerB()}></PlayerCard>
                <Button onClick={() => setPlayerB(null)} variant="outlined">
                  Take off player
                </Button>
                <br />
                <hr />
              </Match>
            </Switch>

            <Show when={!playerB()}>
              <For each={availablePlayers()}>
                {(player) => (
                  <Box
                    sx={{flexGrow: 1, cursor: 'pointer'}}
                    onClick={() => addPlayer(player.id, 'B')}
                  >
                    <PlayerCard player={player} />
                  </Box>
                )}
              </For>
            </Show>
          </Grid>
        </Grid>
      </Box>

      <Button disabled={!(playerA() && playerB())} onClick={onNextStage} variant="contained">
        On next stage
      </Button>
    </>
  );
}
