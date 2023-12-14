package com.projectApi.RatatouilleApi.Menu.Request;

import com.projectApi.RatatouilleApi.Helper.OneOf;
import com.projectApi.RatatouilleApi.Helper.Required;
import com.projectApi.RatatouilleApi.User.Request.UserLoginRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMenuCategoryRequest {
    @NotNull
    private Integer id;
    @NotNull @NotBlank
    private String newName;
}
