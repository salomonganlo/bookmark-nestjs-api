import { PrismaService } from './../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoginDto, AuthDto } from '../src/auth/dto/auth.dto';
describe('App end to end', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(5000);
    pactum.request.setBaseUrl('http://localhost:5000/');

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'hello@gmail.com',
      password: '1234',
      firstname: 'vlad',
      lastname: 'vladmir',
    };

    describe('Signup', () => {
      it('should throw an exception if email empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({
            password: dto.password,
            lastname: dto.lastname,
            firstname: dto.firstname,
          })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Sign in', () => {
      it('it should sign in', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get current user info', () => {
      it('should get current user info', () => {
        return pactum.spec().get('users/me').expectStatus(200).withHeaders({
          Authorization: 'Bearer $S{token}',
        });
      });
    });
    describe('Update User', () => {
      // it('');
    });
  });
  describe('BookMarks', () => {
    describe('Create Bookmarks', () => {
      // it('');
    });

    describe('Get all Bookmarks', () => {
      //it('');
    });

    describe('Get Bookmarks by {:id}', () => {
      //it('');
    });
    describe('Edit Bookmarks by {:id}', () => {
      //it('');
    });

    describe('Delete Bookmark by {:id}', () => {
      //it('');
    });
  });
});
