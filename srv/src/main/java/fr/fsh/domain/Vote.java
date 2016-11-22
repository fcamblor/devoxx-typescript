package fr.fsh.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

import javax.validation.Valid;
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
        String topicTitle;

        @NotNull @Min(0) @Max(3)
        Integer points;

        public String getTopicTitle() {
            return topicTitle;
        }

        public void setTopicTitle(String topicTitle) {
            this.topicTitle = topicTitle;
        }

        public Integer getPoints() {
            return points;
        }

        public void setPoints(Integer points) {
            this.points = points;
        }
    }

    @NotNull @Valid
    @Size(min=3)
    List<VoteEntry> votes;

    @JsonIgnore
    @AssertTrue(message="You cannot spend more than 10 points on your votes")
    public boolean isVotesSumUnderQuota() {
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
