package com.projectApi.RatatouilleApi.Orders.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemCreation;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    @NotNull @PositiveOrZero
    private Integer tableNumber;
    @NotNull @Positive
    private Integer peopleNumber;
    @NotNull @NotEmpty
    private OrderItemCreation[] items;
}
