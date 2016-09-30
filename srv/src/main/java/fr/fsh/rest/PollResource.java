package fr.fsh.rest;

import fr.fsh.domain.Poll;
import restx.WebException;
import restx.annotations.*;
import restx.factory.Component;
import restx.jongo.JongoCollection;
import restx.security.PermitAll;

import javax.inject.Named;

/**
 * Created by fcamblor on 30/09/16.
 */
@RestxResource @Component
public class PollResource {
    JongoCollection polls;

    public PollResource(@Named("polls") JongoCollection polls) {
        this.polls = polls;
    }

    @PermitAll
    @POST("/polls")
    public Poll createPoll(Poll poll) {
        // Ensuring same poll doesn't exist
        if(polls.get().count("{ name: # }", poll.getName()) != 0){
            throw new WebException("A Poll already exists with name : "+poll.getName());
        }

        polls.get().insert(poll);
        return poll;
    }

    @PermitAll
    @GET("/polls")
    public Iterable<Poll> listPolls() {
        return polls.get().find().as(Poll.class);
    }
}
