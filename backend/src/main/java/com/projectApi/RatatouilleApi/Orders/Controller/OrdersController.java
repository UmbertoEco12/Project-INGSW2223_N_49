package com.projectApi.RatatouilleApi.Orders.Controller;

import com.projectApi.RatatouilleApi.Helper.ControllerHelper;
import com.projectApi.RatatouilleApi.Orders.Data.Order;
import com.projectApi.RatatouilleApi.Orders.Repository.OrdersService;
import com.projectApi.RatatouilleApi.Orders.Request.CreateOrderRequest;
import com.projectApi.RatatouilleApi.Orders.Request.UpdateOrderRequest;
import com.projectApi.RatatouilleApi.Orders.Response.CreateOrderTopicMessage;
import com.projectApi.RatatouilleApi.Orders.Response.DeleteOrderTopicMessage;
import com.projectApi.RatatouilleApi.User.Controller.AuthController;
import com.projectApi.RatatouilleApi.User.Controller.AuthControllerWrapper;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrdersController {
    private final AuthService authRepository;
    private final OrdersService ordersRepository;
    private final AuthControllerWrapper wrapper;
    private final SimpMessagingTemplate messagingTemplate;

    public enum OrdersOperations{
        Add,
        Delete,
        Update,
    }
    public static final String TOPIC_DESTINATION_PREFIX = "/topic/orders/";
    @GetMapping()
    public ResponseEntity<List<Order>> getOrders(){
        try
        {
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var orders = ordersRepository.getActivityOrders(activityId);
            if(orders != null)
            {
                return ResponseEntity.ok().body(orders);
            }else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        catch (Exception e)
        {
            System.out.println("get Orders Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping()
    public ResponseEntity<Order> addOrder(@Valid @RequestBody CreateOrderRequest request)
    {
        try
        {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = wrapper.getAuthenticatedUserUsername();
            // find activity id
            User user = authRepository.findByUsername(username);
            Integer activityId = user.getActivityId();
            Integer userId = user.getId();
            var order = ordersRepository.createOrder(activityId, userId, request.getTableNumber(), request.getPeopleNumber(), request.getItems());
            if(order != null){
                var msg = CreateOrderTopicMessage.builder().message(OrdersOperations.Add.toString().toLowerCase(Locale.ROOT)).item(order).build();
                // send topic message to activity
                messagingTemplate.convertAndSend(TOPIC_DESTINATION_PREFIX + order.getActivityId(), msg);
                return ResponseEntity.status(HttpStatus.CREATED).body(order);
            }
            else
            {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e)
        {
            System.out.println("create Order Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrder(@Valid @RequestBody UpdateOrderRequest request,@PathVariable Integer orderId){
        try
        {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            User user = authRepository.findByUsername(username);
            Integer activityId = user.getActivityId();
            Integer userId = user.getId();
            var order = ordersRepository.updateOrder(orderId, request.getCreations(), request.getUpdates());
            if(order != null){
                // send topic message
                var msg = CreateOrderTopicMessage.builder().message(OrdersOperations.Update.toString().toLowerCase(Locale.ROOT)).item(order).build();
                // send topic message to activity
                messagingTemplate.convertAndSend(TOPIC_DESTINATION_PREFIX + order.getActivityId(), msg);
                return ResponseEntity.ok(order);
            }
            else
            {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        catch (Exception e)
        {
            System.out.println("update Order Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{orderItemId}/{status}")
    public ResponseEntity<Order> updateOrderItemStatus(@PathVariable("orderItemId") Integer orderItemId, @PathVariable("status") String status){
        try
        {
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            User user = authRepository.findByUsername(username);
            Integer activityId = user.getActivityId();
            Integer userId = user.getId();
            var order = ordersRepository.updateItemOrderStatus(orderItemId, status);
            if(order != null){
                // send topic message
                var msg = CreateOrderTopicMessage.builder().message(OrdersOperations.Update.toString().toLowerCase(Locale.ROOT)).item(order).build();
                // send topic message to activity
                messagingTemplate.convertAndSend(TOPIC_DESTINATION_PREFIX + order.getActivityId(), msg);
                return ResponseEntity.ok(order);
            }
            else
            {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        catch (Exception e)
        {
            System.out.println("update Item Order status Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer orderId){
        try
        {
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            User user = authRepository.findByUsername(username);
            Integer activityId = user.getActivityId();
            Integer userId = user.getId();
            var res = ordersRepository.deleteOrder(activityId ,orderId);
            if(res){
                // send topic message
                var msg = DeleteOrderTopicMessage.builder()
                        .message(OrdersOperations.Delete.toString().toLowerCase(Locale.ROOT))
                        .id(orderId)
                        .build();
                // send topic message to activity
                messagingTemplate.convertAndSend(TOPIC_DESTINATION_PREFIX + activityId, msg);
                return ResponseEntity.ok("Order deleted successfully");
            }
            else
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (Exception e)
        {
            System.out.println("update Order Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
