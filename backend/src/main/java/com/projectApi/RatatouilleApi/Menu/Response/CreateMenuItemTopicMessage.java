package com.projectApi.RatatouilleApi.Menu.Response;

import com.projectApi.RatatouilleApi.Menu.Data.MenuItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateMenuItemTopicMessage {

    private String message;
    private MenuItem item;

}
