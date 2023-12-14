package com.projectApi.RatatouilleApi.Helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectApi.RatatouilleApi.Menu.Data.ItemCategoryOrder;
import com.projectApi.RatatouilleApi.Menu.Data.ItemChoiceGroup;
import com.projectApi.RatatouilleApi.Menu.Data.MenuCategoryOrder;
import com.projectApi.RatatouilleApi.Menu.Request.UpdateMenuItemCategoryOrderRequest;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItem;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemCreation;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemUpdate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Array;
import java.util.ArrayList;
import java.util.List;
@Repository
public class BaseService {
    protected final JdbcTemplate jdbcTemplate;
    public static final String jobTypeTypeName = "JOB_TYPE_ENUM";
    public static final String itemCategoryOrderTypeName = "ITEM_CATEGORY_ORDER";
    public static final String itemChoiceGroupTypeName = "ITEM_CHOICE_GROUP";
    public static final String categoryMenuOrderTypeName = "CATEGORY_MENU_ORDER";
    public static final String orderStatusTypeName = "ORDER_STATUS";
    public static final String itemOrderUpdateTypeName = "ITEM_ORDER_UPDATE";
    public static final String itemOrderCreationTypeName = "ITEM_ORDER_CREATION";
    public static final String itemUpdateCategoryOrderTypeName = "ITEM_UPDATE_CATEGORY_ORDER";

    public BaseService(JdbcTemplate jdbcTemplate)
    {
        this.jdbcTemplate = jdbcTemplate;
    }

    public static String[] convertArrayToStringArray(Array array) {
        try {
            Object[] objArray = (Object[]) array.getArray();
            List<String> stringList = new ArrayList<>();
            for (Object o : objArray) {
                if (o != null)
                    stringList.add(o.toString());
            }
            String[] arr = new String[stringList.size()];
            return stringList.toArray(arr);
        } catch (Exception e) {
            return new String[0]; // Return an empty array as a default
        }
    }
    public static Integer[] convertArrayToIntegerArray(Array array) {
        try {
            Object[] objArray = (Object[]) array.getArray();
            List<Integer> stringList = new ArrayList<>();
            for (Object o : objArray) {
                if (o != null)
                    stringList.add((Integer) o);
            }
            Integer[] arr = new Integer[stringList.size()];
            return stringList.toArray(arr);
        } catch (Exception e) {
            return new Integer[0]; // Return an empty array as a default
        }
    }

    public static ItemCategoryOrder[] convertArrayToItemCategoryOrderArray(Array array) {
        try {
            Object[] objArray = (Object[]) array.getArray();
            List<ItemCategoryOrder> orderList = new ArrayList<>();

            for (Object o : objArray) {
                if(o != null){
                    var strValue = o.toString();
                    strValue = strValue.replace("\"", "")
                            .replace("(","")
                            .replace(")","");
                    String[] values = strValue.split(",");
                    if (values.length == 2) {
                        int categoryId = Integer.parseInt(values[0].trim());
                        int itemOrder = Integer.parseInt(values[1].trim());
                        orderList.add(new ItemCategoryOrder(categoryId, itemOrder));
                    }
                }
            }
            ItemCategoryOrder[] arr = new ItemCategoryOrder[orderList.size()];
            return orderList.toArray(arr);

        } catch (Exception e) {
            return new ItemCategoryOrder[0]; // Return an empty array as a default
        }
    }

    public static <T> T fromJson(String jsonString, Class<T> valueType) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonString, valueType);
    }
    public static <T> T[] fromJsonArray(String jsonArray, Class<T[]> arrayType) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonArray, arrayType);
    }
    public static ItemCategoryOrder[] convertToItemCategoryOrderArray(Object obj){
        try{
            if(obj != null)
            {
                return fromJsonArray(obj.toString(), ItemCategoryOrder[].class);
            }
            else
                return new ItemCategoryOrder[0];
        }
        catch (Exception e)
        {
            return new ItemCategoryOrder[0];
        }
    }
    public static ItemChoiceGroup[] convertToItemChoiceGroupArray(Object obj){
        try{
            if(obj != null)
            {
                return fromJsonArray(obj.toString(), ItemChoiceGroup[].class);
            }
            else
                return new ItemChoiceGroup[0];
        }
        catch (Exception e)
        {
            return new ItemChoiceGroup[0];
        }
    }
    public static OrderItem[] convertToOrderItemArray(Object obj){
        try{
            if(obj != null)
            {
                return fromJsonArray(obj.toString(), OrderItem[].class);
            }
            else
                return new OrderItem[0];
        }
        catch (Exception e)
        {
            return new OrderItem[0];
        }
    }
    public static String getPSQLArrayFrom(String[] array)
    {
        if(array == null)
            return "";
        StringBuilder s = new StringBuilder("{");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("\"%s\"".formatted(array[i]));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("}");
        return s.toString();
    }
    public static String getPSQLArrayFrom(Integer[] array)
    {
        if(array == null)
            return "";
        StringBuilder s = new StringBuilder("{");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("%s".formatted(array[i]));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("}");
        return s.toString();
    }

    public static String getItemUpdateCategoryOrderPSQLArray(UpdateMenuItemCategoryOrderRequest.ItemUpdateCategoryOrder[] array)
    {
        StringBuilder s = new StringBuilder("ARRAY[");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("(%d,%d)::%s".formatted(array[i].getItemId(), array[i].getItemOrder(),itemUpdateCategoryOrderTypeName));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("]::%s[]".formatted(itemUpdateCategoryOrderTypeName));
        return s.toString();
    }
    public static String getCategoryOrderPSQLArray(MenuCategoryOrder[] array)
    {
        StringBuilder s = new StringBuilder("ARRAY[");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("(%d,%d)::%s".formatted(array[i].getId(), array[i].getMenuOrder(),categoryMenuOrderTypeName));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("]::%s[]".formatted(categoryMenuOrderTypeName));
        return s.toString();
    }

    public static String getItemChoiceGroupPSQLArray(ItemChoiceGroup[] array)
    {
        StringBuilder s = new StringBuilder("ARRAY[");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("('%s','%s')::%s".formatted(array[i].getGroupName(), getPSQLArrayFrom(array[i].getChoices()),itemChoiceGroupTypeName));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("]::%s[]".formatted(itemChoiceGroupTypeName));
        return s.toString();
    }
    public static String getOrderItemCreationPSQLArray(OrderItemCreation[] array)
    {
        StringBuilder s = new StringBuilder("ARRAY[");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("(%d,'%s','%s','%s',%d,'%s','%s')::%s".formatted(
                    array[i].getItemId(),
                    getPSQLArrayFrom(array[i].getPreparationChoices()),
                    getPSQLArrayFrom(array[i].getCustomChanges()),
                    getPSQLArrayFrom(array[i].getIngredientsRemoved()),
                    array[i].getOrderGroupId(),
                    array[i].getStatus(),
                    array[i].getNotes(),
                    itemOrderCreationTypeName));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("]::%s[]".formatted(itemOrderCreationTypeName));
        return s.toString();
    }
    public static String getOrderItemUpdatePSQLArray(OrderItemUpdate[] array)
    {
        StringBuilder s = new StringBuilder("ARRAY[");
        for (int i = 0; i < array.length; i ++)
        {
            s.append("(%d, %d,'%s','%s',%s)::%s".formatted(
                    array[i].getOrderItemId(),
                    array[i].getOrderGroupId(),
                    array[i].getStatus(),
                    array[i].getNotes(),
                    array[i].getIsCanceled().toString(),
                    itemOrderUpdateTypeName));
            if(i < array.length-1)
                s.append(", ");
        }
        s.append("]::%s[]".formatted(itemOrderUpdateTypeName));
        return s.toString();
    }
}
