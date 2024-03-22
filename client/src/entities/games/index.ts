import { NewGameStore } from './store/new-game.store';
import { GameService } from './services/game.service';
import { GameTeamCreateComponent } from './components/game-team-create/game-team-create.component';
import { GameCreateComponent } from './components/game-create/game-create.component';
import { GameCreatePlayerStatisticsComponent } from './components/game-create-player-statistics/game-create-player-statistics.component';
import { IGame } from './types';
import { GAMES_ROUTES } from './routes';
import { GameCreationWidgetComponent } from './widgets/game-creation-widget/game-creation-widget.component';

export {
  // Types
  IGame,

  // Stores
  NewGameStore,

  // Services
  GameService,

  // Utils

  // Components [@deprecated]
  GameCreateComponent,
  GameTeamCreateComponent,
  GameCreatePlayerStatisticsComponent,

  // Widgets
  GameCreationWidgetComponent,
  // Routes
  GAMES_ROUTES,
};
