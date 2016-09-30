package fr.fsh.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

import javax.validation.constraints.*;
import java.util.List;

/**
 * Created by fcamblor on 30/09/16.
 */
public class Vote {

    @ObjectId @Id
    String id;

    @NotNull @Size(min=2)
    String name;

    @NotNull
    String pollId;

    public static class VoteEntry {
        @NotNull
        String topicName;

        @NotNull @Min(1) @Max(3)
        Integer points;

        public String getTopicName() {
            return topicName;
        }

        public void setTopicName(String topicName) {
            this.topicName = topicName;
        }

        public Integer getPoints() {
            return points;
        }

        public void setPoints(Integer points) {
            this.points = points;
        }
    }

    @NotNull @Size(min=3)
    List<VoteEntry> votes;

    @AssertTrue
    public boolean voteEntriesValid() {
        return votes.stream().mapToInt(VoteEntry::getPoints).sum() <= 10;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPollId() {
        return pollId;
    }

    public void setPollId(String pollId) {
        this.pollId = pollId;
    }

    public List<VoteEntry> getVotes() {
        return votes;
    }

    public void setVotes(List<VoteEntry> votes) {
        this.votes = votes;
    }
}
