import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PhoneValidatorModule } from "./phone-validator/phone-validator.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { QueryFailedFilter } from "./query-failed.filter";

@Module({
  imports: [PhoneValidatorModule, ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configSevice: ConfigService) => ({
        type: "postgres",
        host: configSevice.get("DB_HOST"),
        port: configSevice.get("DB_PORT"),
        username: configSevice.get("DB_USER"),
        password: configSevice.get("DB_PASSWORD"),
        database: configSevice.get("DB_NAME"),
        synchronize: true,
        entities: [__dirname + "/**/*.entity{.js, .ts}"]
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_FILTER, useClass: QueryFailedFilter}]
})
export class AppModule {
}
