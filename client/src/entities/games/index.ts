import { GameTeamCreateComponent } from './components/game-team-create/game-team-create.component';
import { GameService } from './services/game.service';
import { GameStore } from './store/game.store';
import { NewGameStore } from './store/new-game.store';

import { GameCreatePlayerStatisticsComponent } from './components/game-create-player-statistics/game-create-player-statistics.component';
import { GameListStatisticsPipe } from './directives/game-list-statistics.pipe';
import { GAMES_ROUTES } from './routes';
import { IGame } from './types';
import { GameCreationWidgetComponent } from './widgets/game-creation-widget/game-creation-widget.component';

export {
  GameCreatePlayerStatisticsComponent,
  // Widgets
  GameCreationWidgetComponent,
  // Pipes
  GameListStatisticsPipe,
  // Routes
  GAMES_ROUTES,
  // Services
  GameService,
  // Stores
  GameStore,
  // Utils
  // Components [@deprecated]
  GameTeamCreateComponent,
  // Types
  IGame,
  NewGameStore,
};
