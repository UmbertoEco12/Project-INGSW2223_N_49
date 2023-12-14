package com.projectApi.RatatouilleApi.Menu.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeleteMenuItemTopicMessage {
    private String message;
    private Integer id;
}
