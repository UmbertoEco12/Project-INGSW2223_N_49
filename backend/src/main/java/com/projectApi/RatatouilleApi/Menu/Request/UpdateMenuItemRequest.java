package com.projectApi.RatatouilleApi.Menu.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
import com.projectApi.RatatouilleApi.Menu.Data.ItemCategoryOrder;
import com.projectApi.RatatouilleApi.Menu.Data.ItemChoiceGroup;
import com.projectApi.RatatouilleApi.User.Request.UserLoginRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMenuItemRequest {
    @NotNull
    private Integer id;
    @NotNull @NotBlank
    private String newName;
    @NotNull
    private String newForeignName;
    @NotNull @PositiveOrZero
    private Float newPrice;
    @NotNull
    private String newDescription;
    @NotNull
    private String newForeignDescription;
    @NotNull
    private String[] newAllergens;
    @NotNull
    private String[] newIngredients;
    @NotNull
    private String[] newCustomChanges;
    @NotNull
    private ItemChoiceGroup[] newChoices;
    @NotNull
    private Boolean newReadyToServe;
}
