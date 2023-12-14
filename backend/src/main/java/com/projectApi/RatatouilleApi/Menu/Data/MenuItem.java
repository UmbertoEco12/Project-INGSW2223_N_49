package com.projectApi.RatatouilleApi.Menu.Data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String foreignName;
    private Float price;
    private String description;
    private String foreignDescription;
    private ItemCategoryOrder[] categories;
    private String[] allergens;
    private ItemChoiceGroup[] choices;
    private String[] ingredients;
    private String[] customChanges;
    private Boolean readyToServe;
}
