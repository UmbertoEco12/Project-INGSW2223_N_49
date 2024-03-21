package com.projectApi.RatatouilleApi.Menu.Controller;

import com.projectApi.RatatouilleApi.Helper.ControllerHelper;
import com.projectApi.RatatouilleApi.Menu.Data.MenuItem;
import com.projectApi.RatatouilleApi.Menu.Repository.MenuItemService;
import com.projectApi.RatatouilleApi.Menu.Request.CreateMenuItemRequest;
import com.projectApi.RatatouilleApi.Menu.Request.UpdateMenuItemCategoryOrderRequest;
import com.projectApi.RatatouilleApi.Menu.Request.UpdateMenuItemRequest;
import com.projectApi.RatatouilleApi.Menu.Response.CreateMenuItemTopicMessage;
import com.projectApi.RatatouilleApi.Menu.Response.DeleteMenuItemTopicMessage;
import com.projectApi.RatatouilleApi.Menu.Response.ReorderMenuItemTopicMessage;
import com.projectApi.RatatouilleApi.User.Controller.AuthController;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
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
@RequestMapping("/menu")
public class MenuItemController {
    private final AuthService authRepository;
    private final MenuItemService menuRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public enum MenuItemOperations{
        Add,
        Delete,
        Update,
        Reorder,
    }

    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getItems()
    {
        try
        {
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var items = menuRepository.getItems(activityId);

            if(items != null)
                return ResponseEntity.ok().body(items);
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (Exception e)
        {
            System.out.println("get Items Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/items")
    public ResponseEntity<MenuItem> addItem(@Valid @RequestBody CreateMenuItemRequest request)
    {
        try
        {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var menuItem = menuRepository.createMenuItem(activityId,request);

            if(menuItem != null){
                // send topic message
                messagingTemplate.convertAndSend("/topic/menu-items/"+activityId,
                        CreateMenuItemTopicMessage.builder()
                        .item(menuItem)
                        .message(
                                MenuItemOperations.Add
                                        .toString().toLowerCase(Locale.ROOT))
                        .build());
                return ResponseEntity.ok().body(menuItem);
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e)
        {
            System.out.println("create Item Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id){
        try{
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();

            var res = menuRepository.deleteMenuItem(activityId, id);
            if(res){
                // send topic message
                messagingTemplate.convertAndSend("/topic/menu-items/"+activityId,
                        DeleteMenuItemTopicMessage.builder()
                                .id(id)
                                .message(
                                        MenuItemOperations.Delete
                                                .toString().toLowerCase(Locale.ROOT))
                                .build());
                return ResponseEntity.ok("Menu Item deleted successfully");
            }
            else
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        }
        catch (Exception e){
            System.out.println("delete MenuItems Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/items")
    public ResponseEntity<MenuItem> updateItem(@Valid @RequestBody UpdateMenuItemRequest request)
    {
        try
        {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var menuItem = menuRepository.updateItem(activityId, request);

            if(menuItem != null){
                // send topic message
                messagingTemplate.convertAndSend("/topic/menu-items/"+activityId,
                        CreateMenuItemTopicMessage.builder()
                                .item(menuItem)
                                .message(
                                        MenuItemOperations.Update
                                                .toString().toLowerCase(Locale.ROOT))
                                .build());
                return ResponseEntity.ok().body(menuItem);
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e)
        {
            System.out.println("update Item Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/items/order/{categoryId}")
    public ResponseEntity<String> updateItemOrder(@Valid @RequestBody UpdateMenuItemCategoryOrderRequest request, @PathVariable Integer categoryId)
    {
        try
        {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var res = menuRepository.updateItemOrders(activityId,request.getOrders(), categoryId);
            if(res){
                // send topic message
                messagingTemplate.convertAndSend("/topic/menu-items/"+activityId,
                        ReorderMenuItemTopicMessage.builder()
                        .categoryId(categoryId)
                        .message(MenuItemOperations.Reorder.toString().toLowerCase(Locale.ROOT))
                        .items(request.getOrders())
                        .build()
                );
                return ResponseEntity.ok().body("Items correctly reordered");
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e)
        {
            System.out.println("update Item order Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/categories/{categoryId}/items/{itemId}")
    public ResponseEntity<MenuItem> addItemToCategory(@PathVariable Integer categoryId, @PathVariable Integer itemId){
        try
        {
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var res = menuRepository.addItemToCategory(activityId,itemId, categoryId);
            if(res != null){
                // send topic message
                messagingTemplate.convertAndSend("/topic/menu-items/"+activityId,
                        CreateMenuItemTopicMessage.builder()
                                .item(res)
                                .message(
                                        MenuItemOperations.Update
                                                .toString().toLowerCase(Locale.ROOT))
                                .build());
                return ResponseEntity.ok().body(res);
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e)
        {
            System.out.println("add Item to category Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/categories/{categoryId}/items/{itemId}")
    public ResponseEntity<MenuItem> removeItemFromCategory(@PathVariable Integer categoryId, @PathVariable Integer itemId){
        try
        {
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var res = menuRepository.removeItemFromCategory(activityId,itemId, categoryId);
            if(res != null){
                // send topic message
                messagingTemplate.convertAndSend("/topic/menu-items/"+activityId,
                        CreateMenuItemTopicMessage.builder()
                                .item(res)
                                .message(
                                        MenuItemOperations.Update
                                                .toString().toLowerCase(Locale.ROOT))
                                .build());
                return ResponseEntity.ok().body(res);
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e)
        {
            System.out.println("remove Item to category Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
