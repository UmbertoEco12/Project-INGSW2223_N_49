package com.projectApi.RatatouilleApi.Orders.Data;

import com.projectApi.RatatouilleApi.Helper.Required;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemCreation {
    @NotNull
    private Integer itemId;
    @NotNull
    private String[] preparationChoices;
    @NotNull
    private String[] customChanges;
    @NotNull
    private String[] ingredientsRemoved;
    @NotNull
    private Integer orderGroupId;
    @NotNull @NotBlank
    private String status;
    @NotNull
    private String notes;
}
