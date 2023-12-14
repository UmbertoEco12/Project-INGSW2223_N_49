package com.projectApi.RatatouilleApi.Orders.Data;

import com.projectApi.RatatouilleApi.Helper.Required;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemUpdate {
    @Required
    private Integer orderItemId;
    @Required
    private Integer orderGroupId;
    @Required
    private String status;
    @Required
    private String notes;
    @Required
    private Boolean isCanceled;
}
