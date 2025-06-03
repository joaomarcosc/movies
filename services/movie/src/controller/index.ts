import { NextFunction, Request, Response } from 'express';
import { MovieRepositoryContract } from '../repos/movieRepositoryContract';
import { CreateMovieSchema, ListMovieSchema } from '../schemas';
import { OutboxService } from '../service/outboxService';
import { OutboxRepository } from '../repos/outboxRepository';
import { RabbitMQConnection } from '../service/rabbitMQConnection';

export class MovieController {
  private movieRepository: MovieRepositoryContract;

  constructor(movieRepository: MovieRepositoryContract) {
    this.movieRepository = movieRepository;
  }

  createMovie = async (
    request: Request<any, any, CreateMovieSchema>,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const data = request.body;

      const outboxRepository = new OutboxRepository();
      const rabbitMQConnection = new RabbitMQConnection();
      const outboxService = new OutboxService(
        outboxRepository,
        rabbitMQConnection,
      );

      await this.movieRepository.create(data);

      await outboxService.enqueueMessages('alertMovieReleaseEmail', {
        content: {
          title: data.title,
          description: data.description,
          releaseDate: data.releaseDate,
        },
        email: user?.email ?? '',
      });

      response.status(201).json({
        message: 'Movie created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (
    request: Request<any, any, any, ListMovieSchema>,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const movies = await this.movieRepository.list(request.query);

      response.status(200).json({
        message: 'Movies retrieved successfully',
        movies,
      });
    } catch (error) {
      next(error);
    }
  };
}
