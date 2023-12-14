package com.projectApi.RatatouilleApi.Menu.Repository;

import com.projectApi.RatatouilleApi.Helper.BaseService;
import com.projectApi.RatatouilleApi.Menu.Data.MenuCategory;
import com.projectApi.RatatouilleApi.Menu.Data.MenuCategoryOrder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoryService extends BaseService {

    public CategoryService(JdbcTemplate jdbcTemplate)
    {
        super(jdbcTemplate);
    }

    public List<MenuCategory> getCategories(int activityId)
    {
        var query = "SELECT * FROM get_categories(%d)".formatted(activityId);
        return jdbcTemplate.query(query, (rs, rowNum) ->
                new MenuCategory(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getInt("menu_order")
                ));
    }
    public MenuCategory createCategory(Integer activityId,String categoryName)
    {
        var query = "SELECT * FROM create_category(%d,'%s')".formatted(
                activityId, categoryName
        );
        return jdbcTemplate.query(query, (rs, rowNum) ->
                new MenuCategory(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getInt("menu_order")
                )).get(0);
    }

    public boolean deleteCategory(Integer activityId, Integer id){
        var query = "SELECT * FROM delete_menu_category(%d,%d)".formatted(
                activityId, id);
        return jdbcTemplate.query(query, (rs, rowNum) ->
                rs.getBoolean(1)).get(0);
    }
    public boolean updateCategoriesOrder(Integer activityId, MenuCategoryOrder[] categories)
    {
        var query = "SELECT * FROM update_categories_order(%d,%s)".formatted(
                activityId,getCategoryOrderPSQLArray(categories)
        );
        return jdbcTemplate.query(query, (rs, rowNum) -> rs.getBoolean(1)).get(0);
    }
    public MenuCategory updateCategory(Integer activityId, Integer categoryId, String newCategoryName){
        var query = "SELECT * FROM update_category(%d, %d,'%s')".formatted(
                activityId, categoryId, newCategoryName
        );
        return jdbcTemplate.query(query, (rs, rowNum) ->
                new MenuCategory(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getInt("menu_order")
                )).get(0);
    }

}
