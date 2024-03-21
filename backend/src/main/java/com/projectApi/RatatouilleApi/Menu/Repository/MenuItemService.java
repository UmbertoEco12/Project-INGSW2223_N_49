package com.projectApi.RatatouilleApi.Menu.Repository;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.projectApi.RatatouilleApi.Helper.BaseService;
import com.projectApi.RatatouilleApi.Menu.Data.ItemCategoryOrder;
import com.projectApi.RatatouilleApi.Menu.Data.ItemChoiceGroup;
import com.projectApi.RatatouilleApi.Menu.Request.*;
import com.projectApi.RatatouilleApi.Menu.Data.MenuItem;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MenuItemService extends BaseService {

    public MenuItemService(JdbcTemplate jdbcTemplate) {
        super(jdbcTemplate);
    }

    public MenuItem getMenuItemFromResSet(ResultSet rs, int rowNum) throws SQLException {
        return MenuItem.builder()
                .id(rs.getInt("id"))
                .name(rs.getString("name"))
                .foreignName(rs.getString("foreign_name"))
                .price(rs.getFloat("price"))
                .description(rs.getString("description"))
                .foreignDescription(rs.getString("foreign_description"))
                .categories(convertToItemCategoryOrderArray(rs.getObject("categories")))
                .allergens(convertArrayToStringArray(rs.getArray("allergens")))
                .ingredients(convertArrayToStringArray(rs.getArray("ingredients")))
                .customChanges(convertArrayToStringArray(rs.getArray("custom_changes")))
                .choices(convertToItemChoiceGroupArray(rs.getObject("choices")))
                .readyToServe(rs.getBoolean("ready_to_serve"))
                .build();
    }

    public MenuItem createMenuItem(Integer activityId, CreateMenuItemRequest request) throws UncategorizedSQLException
    {
        var query = "SELECT * FROM create_menu_item(%d,'%s','%s',%f,'%s','%s','%s','%s','%s','%s',%s,'%s')".formatted(
                activityId,
                getPSQLArrayFrom(request.getCategories()), request.getName(), request.getPrice(), request.getDescription(),
                getPSQLArrayFrom(request.getAllergens()), request.getForeignName(), request.getForeignDescription(), request.getReadyToServe(),
                getPSQLArrayFrom(request.getIngredients()),
                getItemChoiceGroupPSQLArray(request.getChoices()),
                getPSQLArrayFrom(request.getCustomChanges())
        );
        System.out.println(query);
        return jdbcTemplate.query(query, this::getMenuItemFromResSet).get(0);
    }

    public boolean deleteMenuItem(Integer activityId, Integer id)
    {
        var query = "SELECT * FROM delete_menu_item(%d,%d)".formatted(activityId, id);
        return jdbcTemplate.query(query, (rs, rowNum) ->
                rs.getBoolean(1)).get(0);
    }

    public MenuItem updateItem(Integer activityId, UpdateMenuItemRequest item){
        var query = "SELECT * FROM update_menu_item(%d,%d,'%s',%f,'%s','%s','%s','%s','%s','%s',%s,'%s')".formatted(
                activityId, item.getId(), item.getNewName(), item.getNewPrice(), item.getNewDescription(),
                getPSQLArrayFrom(item.getNewAllergens()), item.getNewForeignName(), item.getNewForeignDescription(), item.getNewReadyToServe(),
                getPSQLArrayFrom(item.getNewIngredients()),
                getItemChoiceGroupPSQLArray(item.getNewChoices()),
                getPSQLArrayFrom(item.getNewCustomChanges()));
        System.out.println(query);
        return jdbcTemplate.query(query, this::getMenuItemFromResSet).get(0);
    }

    public boolean updateItemOrders(Integer activityId, UpdateMenuItemCategoryOrderRequest.ItemUpdateCategoryOrder[] orders, Integer categoryId){
        var query = "SELECT * FROM update_menu_item_orders(%d,%s,%d)".formatted(
                activityId,
                getItemUpdateCategoryOrderPSQLArray(orders),
                categoryId);
        System.out.println(query);
        return jdbcTemplate.query(query, (rs, rowNum) ->
                rs.getBoolean(1)).get(0);
    }

    public MenuItem addItemToCategory(Integer activityId, Integer itemId, Integer categoryId){
        var query = "SELECT * FROM add_item_to_category(%d,%d,%d)".formatted(
                activityId, itemId, categoryId);
        return jdbcTemplate.query(query, this::getMenuItemFromResSet).get(0);
    }
    public MenuItem removeItemFromCategory(Integer activityId, Integer itemId, Integer categoryId){
        var query = "SELECT * FROM remove_item_from_category(%d,%d,%d)".formatted(
                activityId, itemId, categoryId);
        return jdbcTemplate.query(query, this::getMenuItemFromResSet).get(0);
    }
    public List<MenuItem> getItems(Integer activityId)
    {
        var query = "SELECT * FROM get_menu_items(%d)".formatted(activityId);
        return jdbcTemplate.query(query, this::getMenuItemFromResSet);
    }

}
