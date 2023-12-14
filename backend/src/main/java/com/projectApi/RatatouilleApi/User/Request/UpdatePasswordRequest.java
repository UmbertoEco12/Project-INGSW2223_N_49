package com.projectApi.RatatouilleApi.User.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
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
public class UpdatePasswordRequest {
    @NotNull @NotBlank
    private String oldPassword;
    @NotNull @NotBlank
    private String newPassword;
}
