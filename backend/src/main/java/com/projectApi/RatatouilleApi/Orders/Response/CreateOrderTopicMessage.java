package com.projectApi.RatatouilleApi.Orders.Response;

import com.projectApi.RatatouilleApi.Menu.Data.MenuItem;
import com.projectApi.RatatouilleApi.Orders.Data.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderTopicMessage {
    private String message;
    private Order item;
}
