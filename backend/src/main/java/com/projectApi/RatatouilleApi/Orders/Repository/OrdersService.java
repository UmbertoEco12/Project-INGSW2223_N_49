package com.projectApi.RatatouilleApi.Orders.Repository;

import com.projectApi.RatatouilleApi.Helper.BaseService;
import com.projectApi.RatatouilleApi.Orders.Data.Order;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemCreation;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemUpdate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class OrdersService extends BaseService {

    public OrdersService(JdbcTemplate jdbcTemplate) {
        super(jdbcTemplate);
    }

    public Order getOrderFromResultSet(ResultSet rs, Integer row)throws SQLException {
        return Order.builder()
                .id(rs.getInt("id"))
                .tableNumber(rs.getInt("table_number"))
                .peopleNumber(rs.getInt("people_number"))
                .createdAt(rs.getTimestamp("created_at").toString())
                .updatedAt(rs.getTimestamp("updated_at").toString())
                .items(convertToOrderItemArray(rs.getObject("items")))
                .activityId(rs.getInt("activity_id"))
                .userId(rs.getInt("user_id"))
                .build();
    }

    public Order createOrder(Integer activityId, Integer userId,
                             Integer tableNumber, Integer peopleNumber,
                             OrderItemCreation[] items){
        var query = "SELECT * FROM create_order(%d,%d,%d,%d,%s)".formatted(
                activityId,userId,
                tableNumber,peopleNumber,
                getOrderItemCreationPSQLArray(items));
        System.out.println(query);
        return jdbcTemplate.query(query, this::getOrderFromResultSet).get(0);
    }

    public Order updateOrder(Integer orderId, OrderItemCreation[] newItems, OrderItemUpdate[] items){
        var query = "SELECT * FROM update_order(%d, %s, %s)".formatted(
                orderId,
                getOrderItemCreationPSQLArray(newItems),
                getOrderItemUpdatePSQLArray(items));
        System.out.println(query);
        return jdbcTemplate.query(query, this::getOrderFromResultSet).get(0);
    }
    public Order updateItemOrderStatus(Integer itemOrderId, String newStatus){
        var query = "SELECT * FROM update_item_order_status(%d, '%s')"
                .formatted(itemOrderId, newStatus);
        System.out.println(query);
        return jdbcTemplate.query(query, this::getOrderFromResultSet).get(0);
    }
    public Boolean deleteOrder(Integer activityId, Integer orderId){
        var query = "SELECT * FROM delete_order(%d, %d)"
                .formatted(activityId, orderId);
        System.out.println(query);
        return jdbcTemplate.query(query, (rs, rowNum) ->
                rs.getBoolean(1)).get(0);
    }
    public List<Order> getActivityOrders(Integer activityId){
        var query = "SELECT * FROM get_activity_orders(%d)".formatted(activityId);
        System.out.println(query);
        return jdbcTemplate.query(query, this::getOrderFromResultSet);
    }
    public List<Order> getUserOrders(Integer userId){
        var query = "SELECT * FROM get_user_orders(%d)".formatted(userId);
        System.out.println(query);
        return jdbcTemplate.query(query, this::getOrderFromResultSet);
    }
}
