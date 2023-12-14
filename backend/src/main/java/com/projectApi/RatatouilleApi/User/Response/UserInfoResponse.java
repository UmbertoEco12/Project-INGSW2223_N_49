package com.projectApi.RatatouilleApi.User.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private Integer id;
    private String username;
    private String role;
    private Boolean isFirstAccess;
    private Integer activityId;
}
