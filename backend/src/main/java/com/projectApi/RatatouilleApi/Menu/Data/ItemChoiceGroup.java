package com.projectApi.RatatouilleApi.Menu.Data;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.projectApi.RatatouilleApi.Helper.Required;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemChoiceGroup {
    @NotNull
    private String groupName;
    @NotNull
    private String[] choices;

    @JsonGetter("choices")
    public String[] getChoices() {
        return choices;
    }
    @JsonSetter("choices")
    public void setChoices(String[] choices) {
        this.choices = choices;
    }

    @JsonSetter("group_name")
    public void setGroupNameFromDB(String groupName) {
        this.groupName = groupName;
    }
    @JsonSetter("groupName")
    public void setGroupNameFromRequest(String groupName) {
        this.groupName = groupName;
    }

    @JsonGetter("groupName")
    public String getGroupName() {
        return groupName;
    }
}
