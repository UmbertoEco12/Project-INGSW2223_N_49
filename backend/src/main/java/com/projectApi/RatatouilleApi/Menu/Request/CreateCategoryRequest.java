package com.projectApi.RatatouilleApi.Menu.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {

    @NotNull @NotEmpty
    private String name;
}
