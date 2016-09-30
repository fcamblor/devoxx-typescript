package fr.fsh;

import restx.factory.Component;
import restx.factory.Module;
import restx.factory.Provides;

import javax.inject.Named;

/**
 * Created by fcamblor on 30/09/16.
 */
@Module
public class DBModule {

    @Provides
    @Named("mongo.db")
    public String dbName() {
        return "workshop-votes";
    }
}
