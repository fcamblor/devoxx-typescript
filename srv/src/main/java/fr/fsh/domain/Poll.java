package fr.fsh.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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
}
