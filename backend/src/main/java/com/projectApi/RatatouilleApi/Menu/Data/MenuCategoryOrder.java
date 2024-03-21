package com.projectApi.RatatouilleApi.Menu.Data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuCategoryOrder {
    private int id;
    private int menuOrder;
}
