package fr.fsh;

import restx.factory.Component;
import restx.factory.Module;
import restx.factory.Provides;
import restx.mongo.MongoModule;

import javax.inject.Named;

/**
 * Created by fcamblor on 30/09/16.
 */
@Module
public class DBModule {

    @Provides
    @Named(MongoModule.MONGO_DB_NAME)
    public String dbName() {
        return "workshop-votes";
    }
}
