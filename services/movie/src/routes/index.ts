import { Router } from 'express';
import { MovieController } from '../controller';
import { MovieRepository } from '../repos/movieRepository';
import { validateBodyRequest } from '../middlewares/validatorSchema';
import { createMovieSchema } from '../schemas';
import { FilesController } from '../controller/files';
import { generateSignedUrlSchema } from '../schemas/files';

export class MovieRoutes {
  public router: Router;
  private controller: MovieController;
  private fileController: FilesController;

  constructor() {
    this.router = Router();
    this.fileController = new FilesController();
    this.controller = new MovieController(new MovieRepository());
    this.routes();
  }

  private routes(): void {
    this.router.all(
      '/createSignedUrl',
      validateBodyRequest(generateSignedUrlSchema),
      this.fileController.generateSignedUrl,
    );
    this.router.post(
      '/movies',
      validateBodyRequest(createMovieSchema),
      this.controller.createMovie,
    );
    this.router.get('/movies', this.controller.list);
  }
}

export default MovieRoutes;
