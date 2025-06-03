import { Insertable, Selectable, Updateable } from 'kysely';
import { Movie } from '../db/generated';
import { db } from '../configs/database';
import { MovieRepositoryContract } from './movieRepositoryContract';
import { ListMovieSchema } from '../schemas';
import { AppError } from '../errors';

export class MovieRepository implements MovieRepositoryContract {
  async create(
    data: Insertable<Movie>,
  ): Promise<Selectable<Movie> | undefined> {
    try {
      const movie = await db
        .insertInto('movie')
        .values(data)
        .returningAll()
        .executeTakeFirst();

      return movie;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw new AppError(500, 'Failed to create movie');
    }
  }

  async findById(id?: string): Promise<Selectable<Movie> | undefined> {
    try {
      if (!id) {
        throw new AppError(400, 'Movie ID is required');
      }
      const movie = await db
        .selectFrom('movie')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();

      if (!movie) {
        throw new AppError(404, 'Movie not found');
      }

      return movie;
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to find movie by ID',
      );
    }
  }

  async update(data: Updateable<Movie>) {
    try {
      if (!data.id) {
        throw new AppError(400, 'Movie ID is required');
      }

      if (!data.userId) {
        throw new AppError(400, 'User ID is required');
      }

      const updatedMovie = await db
        .updateTable('movie')
        .where((eb) =>
          eb.and([
            eb('id', '=', data.id ?? ''),
            eb('userId', '=', data.userId ?? ''),
          ]),
        )
        .set(data)
        .returningAll()
        .executeTakeFirst();

      return updatedMovie;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw new AppError(500, 'Failed to update movie');
    }
  }

  async list(filter: ListMovieSchema) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'releaseDate',
        sortOrder = 'desc',
        search,
      } = filter;

      const query = db
        .selectFrom('movie')
        .selectAll()
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(sortBy, sortOrder);

      if (search) {
        query.where('title', 'like', `%${search}%`);
      }

      const movies = await query.execute();

      return movies;
    } catch (error) {
      console.error('Error listing movies:', error);
      throw new AppError(
        500,
        (error as Error).message || 'Failed to list movies',
      );
    }
  }
}
