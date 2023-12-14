package com.projectApi.RatatouilleApi.Menu.Data;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.projectApi.RatatouilleApi.Helper.Required;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemCategoryOrder{
    @NotNull
    private Integer categoryId;
    @NotNull
    private Integer itemOrder;
    @JsonGetter("categoryId")
    public Integer getCategoryId() {
        return categoryId;
    }
    @JsonSetter("category_id")
    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
    @JsonSetter("item_order")
    public void setItemOrder(Integer itemOrder) {
        this.itemOrder = itemOrder;
    }
    @JsonSetter("categoryId")
    public void setCategoryIdRequest(Integer categoryId) {
        this.categoryId = categoryId;
    }
    @JsonSetter("itemOrder")
    public void setItemOrderRequest(Integer itemOrder) {
        this.itemOrder = itemOrder;
    }
    @JsonGetter("itemOrder")
    public Integer getItemOrder() {
        return itemOrder;
    }
}
