package com.projectApi.RatatouilleApi.Orders.Data;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    private Integer orderItemId;
    private Integer itemId;
    private String[] preparationChoices;
    private String[] customChanges;
    private String[] ingredientsRemoved;
    private Integer orderGroupId;
    private String status;
    private String notes;
    private String orderItemCreatedAt;
    private String orderItemUpdatedAt;
    private Boolean isCanceled;
    private String itemName;
    private Float itemPrice;

    // Getters and Setters using Jackson annotations
    @JsonGetter("orderItemId")
    public Integer getOrderItemId() {
        return orderItemId;
    }

    @JsonSetter("order_item_id")
    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }

    @JsonGetter("itemId")
    public Integer getItemId() {
        return itemId;
    }

    @JsonSetter("item_id")
    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    @JsonGetter("preparationChoices")
    public String[] getPreparationChoices() {
        return preparationChoices;
    }

    @JsonSetter("preparation_choices")
    public void setPreparationChoices(String[] preparationChoices) {
        this.preparationChoices = preparationChoices;
    }

    @JsonGetter("customChanges")
    public String[] getCustomChanges() {
        return customChanges;
    }

    @JsonSetter("custom_changes")
    public void setCustomChanges(String[] customChanges) {
        this.customChanges = customChanges;
    }

    @JsonGetter("ingredientsRemoved")
    public String[] getIngredientsRemoved() {
        return ingredientsRemoved;
    }

    @JsonSetter("ingredients_removed")
    public void setIngredientsRemoved(String[] ingredientsRemoved) {
        this.ingredientsRemoved = ingredientsRemoved;
    }

    @JsonGetter("orderGroupId")
    public Integer getOrderGroupId() {
        return orderGroupId;
    }

    @JsonSetter("order_group_id")
    public void setOrderGroupId(Integer orderGroupId) {
        this.orderGroupId = orderGroupId;
    }

    @JsonGetter("status")
    public String getStatus() {
        return status;
    }

    @JsonSetter("status")
    public void setStatus(String status) {
        this.status = status;
    }

    @JsonGetter("notes")
    public String getNotes() {
        return notes;
    }

    @JsonSetter("notes")
    public void setNotes(String notes) {
        this.notes = notes;
    }

    @JsonGetter("orderItemCreatedAt")
    public String getOrderItemCreatedAt() {
        return orderItemCreatedAt;
    }

    @JsonSetter("order_item_created_at")
    public void setOrderItemCreatedAt(String orderItemCreatedAt) {
        this.orderItemCreatedAt = orderItemCreatedAt;
    }

    @JsonGetter("orderItemUpdatedAt")
    public String getOrderItemUpdatedAt() {
        return orderItemUpdatedAt;
    }

    @JsonSetter("order_item_updated_at")
    public void setOrderItemUpdatedAt(String orderItemUpdatedAt) {
        this.orderItemUpdatedAt = orderItemUpdatedAt;
    }

    @JsonGetter("isCanceled")
    public Boolean getIsCanceled() {
        return isCanceled;
    }

    @JsonSetter("is_canceled")
    public void setIsCanceled(Boolean isCanceled) {
        this.isCanceled = isCanceled;
    }

    @JsonGetter("itemName")
    public String getItemName() {
        return itemName;
    }

    @JsonSetter("item_name")
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    @JsonGetter("itemPrice")
    public Float getItemPrice() {
        return itemPrice;
    }

    @JsonSetter("item_price")
    public void setItemPrice(Float itemPrice) {
        this.itemPrice = itemPrice;
    }
}
