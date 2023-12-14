package com.projectApi.RatatouilleApi.User.Request;


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
public class UpdateActivityRequest {

    @NotNull
    @NotBlank
    private String activityName = "";
    @NotNull
    private String phoneNumber = "";
    @NotNull
    private String address = "";
}
