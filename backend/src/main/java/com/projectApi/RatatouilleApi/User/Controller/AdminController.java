package com.projectApi.RatatouilleApi.User.Controller;

import com.projectApi.RatatouilleApi.Helper.ControllerHelper;
import com.projectApi.RatatouilleApi.User.Data.Activity;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Data.UserStaff;
import com.projectApi.RatatouilleApi.User.Repository.AdminService;
import com.projectApi.RatatouilleApi.User.Request.UpdateActivityRequest;
import com.projectApi.RatatouilleApi.User.Request.UserCreationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService repository;
    private final AuthControllerWrapper wrapper;


    @PostMapping("/staff")
    public ResponseEntity<UserStaff> createUser(@Valid @RequestBody UserCreationRequest request){
        try
        {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            // send Forbidden if try to create admin user.
            if(request.getRole().equals(User.Authorities.ROLE_ADMIN))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            // password check
            if (AuthController.isWeakPassword(request.getPassword())) {
                return ResponseEntity.unprocessableEntity().build();
            }
            var username = wrapper.getAuthenticatedUserUsername();
            UserStaff user = repository.createUser(username, request.getUsername(), request.getPassword(), request.getRole());
            if (user != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(user);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        catch (DuplicateKeyException ex) {
            // Handle the unique constraint violation
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        catch (DataIntegrityViolationException e)
        {
            // wrong enum value
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
        }
        catch (Exception e){
            System.out.println("create Staff Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Integer id){
        try
        {
            var username = AuthController.getAuthenticatedUserUsername();
            boolean res = repository.deleteUser(username, id);
            if (res) {
                return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
        catch (Exception e){
            System.out.println("delete Staff Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/staff")
    public ResponseEntity<List<UserStaff>> getStaffMembers() {

        try {
            var username = AuthController.getAuthenticatedUserUsername();
            List<UserStaff> staff = repository.getStaff(username);

            if (staff != null) {
                // Successful update
                return ResponseEntity.ok(staff);
            } else {
                // Username update failed
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            System.out.println("get Staff Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<Activity> getActivity() {
        try {
            var username = AuthController.getAuthenticatedUserUsername();
            var activity = repository.getActivity(username);
            // change icon to get
            if (activity != null) {
                return ResponseEntity.ok(activity);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (Exception e) {
            System.out.println("get Activity Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/activity")
    public ResponseEntity<Activity> updateActivity(@Valid @RequestBody UpdateActivityRequest request){
        try {
            var username = AuthController.getAuthenticatedUserUsername();
            var activity = repository.updateActivity(username, request.getActivityName(), request.getAddress(), request.getPhoneNumber());

            if (activity != null) {
                return ResponseEntity.ok(activity);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
        catch (Exception e){
            System.out.println("update Activity Error: " + e.getClass());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
