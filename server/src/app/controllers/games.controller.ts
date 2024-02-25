import {IControllerArgs} from '.';
import {GameService} from '../services/game.service';

export class GamesController {
  async create({request, response}: Omit<IControllerArgs, 'next'>) {
    const body = request.body;
    console.log(body);

    // const gameService = new GameService();
    // const game = await gameService.create(request.body);

    // response.json(game);

    response.json({ok: true});
  }
}
