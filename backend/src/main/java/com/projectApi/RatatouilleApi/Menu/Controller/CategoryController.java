package com.projectApi.RatatouilleApi.Menu.Controller;

import com.projectApi.RatatouilleApi.Helper.ControllerHelper;
import com.projectApi.RatatouilleApi.Menu.Data.MenuCategory;
import com.projectApi.RatatouilleApi.Menu.Repository.CategoryService;
import com.projectApi.RatatouilleApi.Menu.Request.CreateCategoryRequest;
import com.projectApi.RatatouilleApi.Menu.Request.UpdateCategoriesOrderRequest;
import com.projectApi.RatatouilleApi.Menu.Request.UpdateMenuCategoryRequest;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/menu")
public class CategoryController {
    private final AuthService authRepository;
    private final CategoryService categoryRepository;

    private final SimpMessagingTemplate messagingTemplate;

    public void sendCategories(Integer activityId){
        var categories = categoryRepository.getCategories(activityId);
        messagingTemplate.convertAndSend("/topic/categories/"+activityId, categories);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategory>> getCategories(){
        try{
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();

            var res = categoryRepository.getCategories(activityId);
            if(res != null)
                return ResponseEntity.ok(res);
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
        catch (Exception e){
        System.out.println("get Categories Error: " + e.getClass());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<MenuCategory> addCategory(@Valid @RequestBody CreateCategoryRequest request){
        try{
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();

            var res = categoryRepository.createCategory(activityId, request.getName());
            if(res != null){
                // call the web socket
                sendCategories(activityId);
                return ResponseEntity.ok(res);
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e){
            System.out.println("add Categories Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer id){
        try{
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();

            var res = categoryRepository.deleteCategory(activityId, id);
            if(res){
                // call the web socket
                sendCategories(activityId);
                return ResponseEntity.ok("Category deleted successfully");
            }
            else
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        }
        catch (Exception e){
            System.out.println("delete Categories Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/categories/order")
    public ResponseEntity<String> updateCategoriesOrder(@Valid @RequestBody UpdateCategoriesOrderRequest request){
        try
        {
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();
            var res = categoryRepository.updateCategoriesOrder(activityId, request.getCategories());
            if(res)
            {
                // call the web socket
                sendCategories(activityId);
                return ResponseEntity.ok("All categories were updated");
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (Exception e){
            System.out.println("update Categories order Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/categories")
    public ResponseEntity<MenuCategory> updateCategory(@Valid @RequestBody UpdateMenuCategoryRequest request){
        try{
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            String username = AuthController.getAuthenticatedUserUsername();
            // find activity id
            Integer activityId = authRepository.findByUsername(username).getActivityId();

            var res = categoryRepository.updateCategory(activityId, request.getId(), request.getNewName());
            if(res != null){
                // call the web socket
                sendCategories(activityId);
                return ResponseEntity.ok(res);
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (Exception e){
            System.out.println("update Category Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
