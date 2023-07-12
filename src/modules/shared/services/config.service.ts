/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

type TypeOrmConfig = TypeOrmModuleOptions & {
  seeds: string[];
  factories: string[];
};
@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync('.env')) as unknown as {
      [key: string]: string;
    };
  }
  private int(value: string | undefined, number: number): number {
    return value
      ? Number.isNaN(Number.parseInt(value))
        ? number
        : Number.parseInt(value)
      : number;
  }

  private bool(value: string | undefined, boolean: boolean): boolean {
    return value === null || value === undefined ? boolean : value === 'true';
  }

  private cors(value: string | undefined): string[] | 'all' {
    if (value === 'all' || value === undefined) {
      return 'all';
    }

    return value
      ? value.split(',').map((name) => name.trim())
      : ['http://localhost:3000'];
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || this.envConfig['JWT_SECRET'] || 'test';
  }

  get accessTokenExpiry(): string {
    return (
      process.env.ACCESS_TOKEN_EXPIRY ||
      this.envConfig['ACCESS_TOKEN_EXPIRY'] ||
      '7d'
    );
  }
  get saltRounds(): number {
    return this.int(
      process.env.SALT_ROUNDS || this.envConfig['SALT_ROUNDS'],
      10,
    );
  }
  get preHashSalt(): string {
    return (
      process.env.PRE_HASH_SALT ||
      this.envConfig['PRE_HASH_SALT'] ||
      'test-hash'
    );
  }
  get env(): string {
    return this.envConfig['ENVIRONMENT'] || 'local';
  }

  get host(): string {
    return this.envConfig['HOST'] || '127.0.0.1';
  }

  get port(): number {
    return this.int(this.envConfig['PORT'], 3131);
  }

  get corsAllowedOrigins(): string[] | string {
    return this.cors(this.envConfig['CORS_ALLOWED_ORIGINS'] || 'all');
  }

  get corsEnabled(): boolean {
    return this.bool(this.envConfig['CORS_ENABLED'], true);
  }

  get environment(): string {
    return this.envConfig['ENVIRONMENT'] || 'dev';
  }

  get apiVersion(): string {
    return this.envConfig['API_VERSION'] || 'api/v1';
  }

  get appName(): string {
    return this.envConfig['APP_NAME'] || 'NotSet';
  }

  get version(): string {
    return this.envConfig['VERSION'] || 'NotSet';
  }

  get commit(): string {
    return this.envConfig['COMMIT'] || 'NotSet';
  }

  get branch(): string {
    return this.envConfig['BRANCH'] || 'NotSet';
  }

  get pipelineNumber(): string {
    return this.envConfig['PIPELINE_NUMBER'] || 'NotSet';
  }

  get mysqlPort(): number {
    return (
      this.int(process.env.MYSQL_PORT, 0) ||
      this.int(this.envConfig['MYSQL_PORT'], 3306)
    );
  }
  get mysqlPassword(): string {
    return (
      process.env.MYSQL_PASSWORD ||
      this.envConfig['MYSQL_PASSWORD'] ||
      'password'
    );
  }
  get mysqlUsername(): string {
    return (
      process.env.MYSQL_USERNAME || this.envConfig['MYSQL_USERNAME'] || 'user'
    );
  }
  get mysqlHost(): string {
    return (
      process.env.MYSQL_HOST || this.envConfig['MYSQL_HOST'] || 'localhost'
    );
  }
  get mysqlDatabase(): string {
    return (
      process.env.MYSQL_DATABASE ||
      this.envConfig['MYSQL_DATABASE'] ||
      'database'
    );
  }

  get mysqlEnableTypeOrmLog(): boolean {
    return this.bool(this.envConfig['MYSQL_ENABLE_TYPEORM_LOG'], true);
  }

  get auth0Domain(): string {
    return this.envConfig['AUTH0_DOMAIN'] || '';
  }

  get auth0Audience(): string {
    return this.envConfig['AUTH0_AUDIENCE'] || '';
  }

  get auth0ClientId(): string {
    return this.envConfig['AUTH0_CLIENT_ID'] || '';
  }

  get auth0ClientSecret(): string {
    return this.envConfig['AUTH0_CLIENT_SECRET'] || '';
  }

  get accessTokenHour(): number {
    return this.int(this.envConfig['ACCESS_TOKEN_HOUR'], 1);
  }

  get refreshTokenDay(): number {
    return this.int(this.envConfig['REFRESH_TOKEN_DAY'], 1);
  }

  get authenticationMethod(): string {
    return this.envConfig['AUTHENTICATION_METHOD'] || '';
  }

  get jwtAccessTokenSecret(): string {
    return this.envConfig['JWT_SECRET'] || 'JWT TOKENS SECRET';
  }

  get jwtRefreshTokenSecret(): string {
    return this.envConfig['JWT_REFRESH_SECRET'] || 'JWT REFRESH SECRET';
  }

  get authEmailAddressClaim(): string {
    return this.envConfig['AUTH0_EMAIL_ADDRESS_CLAIM'] || '';
  }

  get authEmailVerifiedClaim(): string {
    return this.envConfig['AUTH0_EMAIL_VERIFIED_CLAIM'] || '';
  }

  get getAWSS3BucketName(): string {
    return this.envConfig['AWS_S3_BUCKET_NAME'] || '';
  }

  get getAWSAccessKeyId(): string {
    return this.envConfig['AWS_ACCESS_KEY_ID'] || '';
  }

  get getAWSSecretAccessKey(): string {
    return this.envConfig['AWS_SECRET_ACCESS_KEY'] || '';
  }

  get getAWSRegion(): string {
    return this.envConfig['AWS_REGION'] || '';
  }

  get getAWSSessionToken(): string {
    return this.envConfig['AWS_SESSION_TOKEN'] || '';
  }

  get getAWSSESMailSoure(): string {
    return this.envConfig['AWS_SES_MAIL_SOURE'] || '';
  }

  get auth0JwksUri(): string {
    return this.envConfig['AUTH0_JWKS_URI'] || '';
  }

  get auth0AuthorizationUrl(): string {
    return this.envConfig['AUTH0_AUTHORIZATION_URL'] || '';
  }

  get auth0TokenUrl(): string {
    return this.envConfig['AUTH0_TOKEN_URL'] || '';
  }

  get auth0OauthUrl(): string {
    return this.envConfig['AUTH0_OAUTH_URL'] || '';
  }

  get auth0ApiManagementAudience(): string {
    return this.envConfig['AUTH0_API_MANAGEMENT_AUDIENCE'] || '';
  }

  get auth0CredentialUrl(): string {
    return this.envConfig['AUTH0_CREDENTIAL_URL'] || '';
  }

  get auth0UsersApiUrl(): string {
    return this.envConfig['AUTH0_USERS_API_URL'] || '';
  }
  get domainWebApp(): string {
    return this.envConfig['DOMAIN_WEB_APP'] || '';
  }

  get userVerificationExpirationDay(): number {
    return this.int(this.envConfig['USER_VERIFICATION_EXPIRATION_DAY'], 1);
  }

  get rootEmail(): string {
    return this.envConfig['GMAIL_USER'] || '';
  }

  get rootEmailAppPass(): string {
    return this.envConfig['APP_PASSWORD'] || '';
  }

  get frontendURL(): string {
    return this.envConfig['URL_REACT'] || '';
  }

  get googleClientId(): string {
    return this.envConfig['GOOGLE_CLIEND_ID'] || '';
  }

  get googleClientSecret(): string {
    return this.envConfig['GOOGLE_CLIEND_SECRET'] || '';
  }

  get configJson(): any {
    const entities = [
      path.join(__dirname + '/../../../**/*.entity{.ts,.js}'),
      path.join(__dirname + '/../../../**/*.view-entity{.ts,.js}'),
    ];
    const migrations = [
      path.join(__dirname + '/../../../../database/migrations/*{.ts,.js}'),
    ];
    const factories = [
      path.join(
        __dirname + '/../../../../database/seeds/factories/*.factory{.ts,.js}',
      ),
    ];
    const seeds = [
      path.join(__dirname + '/../../../../database/seeds/*.seed{.ts,.js}'),
    ];
    return {
      type: 'mysql',
      host: this.mysqlHost,
      port: this.mysqlPort,
      username: this.mysqlUsername,
      password: this.mysqlPassword,
      database: this.mysqlDatabase,
      synchronize: false,
      subscribers: [],
      migrationsRun: true,
      entities,
      migrations,
      factories,
      seeds,
    };
  }

  get mysqlConfig(): TypeOrmConfig {
    const config: TypeOrmConfig = {
      ...this.configJson,
    };
    return config;
  }

  get mysqlDataSource(): DataSource {
    const config = new DataSource({
      ...this.configJson,
    });
    return config;
  }

  get sentryDsn(): string {
    return this.envConfig['SENTRY_DSN'] || '';
  }
}
