package fr.fsh.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by fcamblor on 30/09/16.
 */
public class Topic {

    public enum Category {
        BACK, FRONT, TOOLING
    }

    @NotNull @Size(min=5)
    String title;
    @NotNull
    Category category;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
