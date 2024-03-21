package com.projectApi.RatatouilleApi.Orders.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeleteOrderTopicMessage {
    private String message;
    private Integer id;
}
