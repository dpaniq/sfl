import {IControllerArgs} from '.';
import {GameService} from '../services/game.service';

export class GamesController {
  async create({request, response}: Omit<IControllerArgs, 'next'>) {
    const gameService = new GameService();
    const game = await gameService.create(request.body);

    response.json(game);
  }
}
