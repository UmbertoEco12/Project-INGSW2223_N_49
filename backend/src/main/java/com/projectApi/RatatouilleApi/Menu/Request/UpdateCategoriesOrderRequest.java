package com.projectApi.RatatouilleApi.Menu.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
import com.projectApi.RatatouilleApi.Menu.Data.MenuCategoryOrder;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCategoriesOrderRequest {
    @NotNull @NotEmpty
    private MenuCategoryOrder[] categories;
}
