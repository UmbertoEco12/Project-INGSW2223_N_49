package com.projectApi.RatatouilleApi.Orders.Request;

import com.projectApi.RatatouilleApi.Orders.Data.OrderItemCreation;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderRequest {
    @NotNull
    private OrderItemUpdate[] updates;
    @NotNull
    private OrderItemCreation[] creations;
}
