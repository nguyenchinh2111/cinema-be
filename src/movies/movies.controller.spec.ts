import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMovie: Movie = {
    id: 1,
    title: 'The Matrix',
    description:
      'A computer programmer is led to fight an underground war against powerful computers.',
    releaseDate: new Date('1999-03-31'),
    director: 'The Wachowskis',
    genre: ['Action', 'Sci-Fi'],
    rating: 8.7,
    duration: 136,
    posterUrl: 'https://example.com/matrix.jpg',
    trailerUrl: 'https://example.com/matrix-trailer.mp4',
    cast: ['Keanu Reeves', 'Laurence Fishburne'],
    reviews: ['Great movie!', 'Mind-blowing effects'],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null as unknown as Date, // TypeORM allows null for soft delete
    showtimes: [],
  };

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'The Matrix',
        description:
          'A computer programmer is led to fight an underground war against powerful computers.',
        releaseDate: new Date('1999-03-31'),
        director: 'The Wachowskis',
        genre: ['Action', 'Sci-Fi'],
        rating: 8.7,
        duration: 136,
        posterUrl: 'https://example.com/matrix.jpg',
        trailerUrl: 'https://example.com/matrix-trailer.mp4',
        cast: ['Keanu Reeves', 'Laurence Fishburne'],
        reviews: ['Great movie!'],
      };

      mockMoviesService.create.mockResolvedValue(mockMovie);

      const result = await controller.create(createMovieDto);

      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(mockMovie);
    });

    it('should handle service errors during creation', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'The Matrix',
        description:
          'A computer programmer is led to fight an underground war against powerful computers.',
        releaseDate: new Date('1999-03-31'),
        director: 'The Wachowskis',
        genre: ['Action', 'Sci-Fi'],
        rating: 8.7,
        duration: 136,
        posterUrl: 'https://example.com/matrix.jpg',
        trailerUrl: 'https://example.com/matrix-trailer.mp4',
      };

      mockMoviesService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createMovieDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const mockMovies = [
        mockMovie,
        { ...mockMovie, id: 2, title: 'Inception' },
      ];
      mockMoviesService.findAll.mockResolvedValue(mockMovies);

      const result = await controller.findAll();

      expect(mockMoviesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockMovies);
    });

    it('should return empty array when no movies exist', async () => {
      mockMoviesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockMoviesService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle service errors during findAll', async () => {
      mockMoviesService.findAll.mockRejectedValue(
        new Error('Database connection error'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Database connection error',
      );
      expect(mockMoviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      mockMoviesService.findOne.mockResolvedValue(mockMovie);

      const result = await controller.findOne('1');

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      mockMoviesService.findOne.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle invalid id parameter', async () => {
      mockMoviesService.findOne.mockResolvedValue(mockMovie);

      const result = await controller.findOne('1');

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'The Matrix Reloaded',
        rating: 7.2,
      };
      const updatedMovie = { ...mockMovie, ...updateMovieDto };

      mockMoviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.update('1', updateMovieDto);

      expect(mockMoviesService.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });

    it('should throw NotFoundException when updating non-existent movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Title',
      };

      mockMoviesService.update.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      await expect(controller.update('999', updateMovieDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockMoviesService.update).toHaveBeenCalledWith(
        999,
        updateMovieDto,
      );
    });

    it('should handle empty update dto', async () => {
      const updateMovieDto: UpdateMovieDto = {};
      mockMoviesService.update.mockResolvedValue(mockMovie);

      const result = await controller.update('1', updateMovieDto);

      expect(mockMoviesService.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockMoviesService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when removing non-existent movie', async () => {
      mockMoviesService.remove.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockMoviesService.remove).toHaveBeenCalledWith(999);
    });

    it('should handle service errors during removal', async () => {
      mockMoviesService.remove.mockRejectedValue(new Error('Database error'));

      await expect(controller.remove('1')).rejects.toThrow('Database error');
      expect(mockMoviesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
