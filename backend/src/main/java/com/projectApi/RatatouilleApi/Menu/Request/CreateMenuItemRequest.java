package com.projectApi.RatatouilleApi.Menu.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
import com.projectApi.RatatouilleApi.Menu.Data.ItemChoiceGroup;
import com.projectApi.RatatouilleApi.User.Request.UserLoginRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class CreateMenuItemRequest {
    @NotNull @NotBlank
    private String name;
    @NotNull
    private String foreignName;
    @NotNull @PositiveOrZero
    private Float price;
    @NotNull
    private String description;
    @NotNull
    private String foreignDescription;
    @NotNull @NotEmpty
    private Integer[] categories;
    @NotNull
    private String[] allergens;
    @NotNull
    private String[] ingredients;
    @NotNull
    private String[] customChanges;
    @NotNull
    private ItemChoiceGroup[] choices;
    @NotNull
    private Boolean readyToServe;
}
