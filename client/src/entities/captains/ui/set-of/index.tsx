import CaptainCards from "../captains-cards";

import CapitansListJSON from "../../../shared/api/captains/mock/list.json";
import { Button, Box, Grid, Typography } from "@suid/material";
import { createSignal, For, Switch, Match, Show } from "solid-js";
import CaptainCard from "../captain-card";
import { useNewMatchStore } from "@root/src/context/newMatchContext";

interface PropsInterface {
  onNextStage: () => any;
}

export default function SetOfCaptains({ onNextStage }: PropsInterface) {
  const {
    store: [store, setStore],
  } = useNewMatchStore();

  const handlerOnNextStage = () => {
    console.log(store);
    console.log(store.captains);
    console.log(store.players);
    // onNextStage()
  };

  const [canNextStage, setCanNextStage] = createSignal(false);

  const [captains] = createSignal<ICaptain[]>(CapitansListJSON);

  const [captainA, setCaptainA] = createSignal<ICaptain | null>(null);
  const [captainB, setCaptainB] = createSignal<ICaptain | null>(null);

  const availableCaptains = () =>
    captains().filter((captain) => {
      return ![captainA()?.id, captainB()?.id].includes(captain.id);
    });

  // https://github.com/solidjs/solid/discussions/866
  const addCaptain = (id, team) => {
    const captain = captains().find((captain) => captain.id === id);
    if (captain) {
      switch (team) {
        case "A":
          setStore("captains", [
            ...store.captains,
            {
              ...captain,
              team,
            },
          ]);

          return setCaptainA({
            ...captain,
            team,
          });
        case "B":
          setStore("captains", [
            ...store.captains,
            {
              ...captain,
              team,
            },
          ]);

          return setCaptainB({
            ...captain,
            team,
          });
        default:
          return null;
      }
    }
  };

  return (
    <>
      <h1>II. Set of captains</h1>
      <hr />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <h2>Choosen:</h2>
            <Switch fallback={"Please choose captain below:"}>
              <Match when={captainA()}>
                <Typography component={"p"} textAlign="center">
                  Your choise is:
                </Typography>
                <CaptainCard captain={captainA()}></CaptainCard>

                <Button onClick={() => setCaptainA(null)} variant="outlined">
                  Take off captain
                </Button>
                <br />
                <hr />
              </Match>
            </Switch>

            <Show when={!captainA()}>
              <For each={availableCaptains()}>
                {(captain) => (
                  <Box
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => addCaptain(captain.id, "A")}
                  >
                    <CaptainCard captain={captain} />
                  </Box>
                )}
              </For>
            </Show>
          </Grid>

          <Grid item xs={6} sx={{ flexGrow: 1 }}>
            <h2>Choosen:</h2>
            <Switch fallback={"Please choose captain below:"}>
              <Match when={captainB()}>
                <Typography component={"p"} textAlign="center">
                  Your choise is:
                </Typography>
                <CaptainCard captain={captainB()}></CaptainCard>
                <Button onClick={() => setCaptainB(null)} variant="outlined">
                  Take off captain
                </Button>
                <br />
                <hr />
              </Match>
            </Switch>

            <Show when={!captainB()}>
              <For each={availableCaptains()}>
                {(captain) => (
                  <Box
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => addCaptain(captain.id, "B")}
                  >
                    <CaptainCard captain={captain} />
                  </Box>
                )}
              </For>
            </Show>
          </Grid>
        </Grid>
      </Box>

      <Button
        disabled={!(captainA() && captainB())}
        onClick={handlerOnNextStage}
        variant="contained"
      >
        On next stage
      </Button>
    </>
  );
}
