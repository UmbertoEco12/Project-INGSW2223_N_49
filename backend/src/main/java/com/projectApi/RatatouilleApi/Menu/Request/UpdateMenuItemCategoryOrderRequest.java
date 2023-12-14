package com.projectApi.RatatouilleApi.Menu.Request;

import com.projectApi.RatatouilleApi.Helper.Required;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMenuItemCategoryOrderRequest {
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemUpdateCategoryOrder {
        @NotNull
        private Integer itemId;
        @NotNull
        private Integer itemOrder;
    }

    @NotNull @NotEmpty
    private ItemUpdateCategoryOrder[] orders;
}
