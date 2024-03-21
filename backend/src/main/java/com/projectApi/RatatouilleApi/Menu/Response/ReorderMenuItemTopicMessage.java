package com.projectApi.RatatouilleApi.Menu.Response;

import com.projectApi.RatatouilleApi.Menu.Request.UpdateMenuItemCategoryOrderRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReorderMenuItemTopicMessage {
    private String message;
    private Integer categoryId;
    private UpdateMenuItemCategoryOrderRequest.ItemUpdateCategoryOrder[] items;
}
