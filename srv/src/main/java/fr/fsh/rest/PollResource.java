package fr.fsh.rest;

import com.google.common.base.Optional;
import fr.fsh.domain.Poll;
import fr.fsh.domain.Vote;
import org.bson.types.ObjectId;
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
    JongoCollection votes;

    public PollResource(@Named("polls") JongoCollection polls, @Named("votes") JongoCollection votes) {
        this.polls = polls;
        this.votes = votes;
    }

    @PermitAll
    @POST("/polls")
    @Consumes("application/json;view=fr.fsh.rest.Views$Detail")
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
    @Produces("application/json;view=fr.fsh.rest.Views$Listing")
    public Iterable<Poll> listPolls() {
        return polls.get().find().as(Poll.class);
    }

    @PermitAll
    @GET("/polls/{uuid}")
    @Produces("application/json;view=fr.fsh.rest.Views$Detail")
    public Optional<Poll> findPollById(String uuid) {
        return Optional.fromNullable(polls.get().findOne(new ObjectId(uuid)).as(Poll.class));
    }

    @PermitAll
    @POST("/polls/{pollId}/votes")
    public Vote createVote(String pollId, Vote vote) {
        if(!pollId.equals(vote.getPollId())) {
            throw new WebException("Inconsistent poll id");
        }
        if(votes.get().count("{ pollId: #, name: # }", vote.getPollId(), vote.getName()) != 0) {
            throw new WebException("Can't vote twice for the same poll !");
        }
        votes.get().insert(vote);
        return vote;
    }

    @PermitAll
    @GET("/polls/{pollId}/votes")
    public Iterable<Vote> listVotes(String pollId){
        return votes.get().find("{ pollId: # }", pollId).as(Vote.class);
    }
}
