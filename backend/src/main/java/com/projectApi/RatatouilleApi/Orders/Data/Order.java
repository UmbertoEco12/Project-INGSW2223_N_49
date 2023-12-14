package com.projectApi.RatatouilleApi.Orders.Data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private Integer id;
    private Integer tableNumber;
    private Integer peopleNumber;
    private Integer activityId;
    private Integer userId;
    private String createdAt;
    private String updatedAt;
    private OrderItem[] items;
}
