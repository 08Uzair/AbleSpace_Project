import { Global, Module, DynamicModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { resolveMongoUri } from "./database-uri";

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            const { uri, via } = await resolveMongoUri(
              config.get<string>("MONGODB_URI")
            );
            console.log(`Connected to MongoDB Atlas (${via})`);
            return { uri };
          },
        }),
      ],
      exports: [MongooseModule],
    };
  }
}
