package com.projectApi.RatatouilleApi.User.Request;

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
public class AdminCredentials {
    @NotNull
    @NotBlank(message ="username is mandatory")
    private String adminUsername;
    @NotNull
    @NotBlank(message ="password is mandatory")
    private String adminPassword;
}
