import { Insertable, Selectable } from 'kysely';
import { Movie } from '../db/generated';
import { ListMovieSchema } from '../schemas';

export interface MovieRepositoryContract {
  create: (data: Insertable<Movie>) => Promise<Selectable<Movie> | undefined>;
  list: (data: ListMovieSchema) => Promise<Selectable<Movie>[] | undefined>;
}
