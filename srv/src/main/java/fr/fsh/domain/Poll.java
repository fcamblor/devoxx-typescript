package fr.fsh.domain;

import com.fasterxml.jackson.annotation.JsonView;
import fr.fsh.rest.Views;
import org.joda.time.DateTime;
import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * Created by fcamblor on 30/09/16.
 */
public class Poll {
    @Id
    @ObjectId
    private String id;

    @NotNull
    @Size(min = 5)
    String name;

    @NotNull
    DateTime date;

    @NotNull
    @Size(min = 1)
    @Valid
    @JsonView({Views.Private.class, Views.Detail.class})
    List<Topic> topics;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DateTime getDate() {
        return date;
    }

    public void setDate(DateTime date) {
        this.date = date;
    }
}
