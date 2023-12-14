package com.projectApi.RatatouilleApi.User.Controller;

import com.projectApi.RatatouilleApi.Helper.ControllerHelper;
import com.projectApi.RatatouilleApi.JwtService;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import com.projectApi.RatatouilleApi.User.Request.*;
import com.projectApi.RatatouilleApi.User.Response.LoginResponse;
import com.projectApi.RatatouilleApi.User.Response.UserInfoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController  {

    private final AuthService repository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private final AuthControllerWrapper wrapper;
    public static boolean isWeakPassword(String password){
        return !isStrongPassword(password);
    }
    public static boolean isStrongPassword(String password) {
        // Check if the password is at least 8 characters long
        if (password.length() < 8) {
            return false;
        }

        // Check for at least one uppercase letter, one lowercase letter, and one number
        boolean hasUppercase = false;
        boolean hasLowercase = false;
        boolean hasDigit = false;

        for (char ch : password.toCharArray()) {
            if (Character.isUpperCase(ch)) {
                hasUppercase = true;
            } else if (Character.isLowerCase(ch)) {
                hasLowercase = true;
            } else if (Character.isDigit(ch)) {
                hasDigit = true;
            }
        }

        return hasUppercase && hasLowercase && hasDigit;
    }
    public static String getAuthenticatedUserUsername(){
        // get username from token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody UserLoginRequest request)
    {
        try {
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            // Call the login function using UserRepository
            UsernamePasswordAuthenticationToken authenticatedUser = (UsernamePasswordAuthenticationToken)authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),request.getPassword()
                    )
            );
            if (authenticatedUser != null) {
                // Successful login
                User user = (User) authenticatedUser.getDetails();
                var jwtToken = jwtService.generateToken(user);
                return ResponseEntity.ok(
                        LoginResponse.builder()
                                .token(jwtToken)
                                .user(
                                        UserInfoResponse.builder()
                                                .id(user.getId())
                                                .username(user.getUsername())
                                                .isFirstAccess(user.isFirstAccess())
                                                .role(user.getJobType())
                                                .activityId(user.getActivityId())
                                                .build())
                                .build());
            } else {
                // server error
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (BadCredentialsException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/user/password")
    public ResponseEntity<String> updatePassword(@Valid @RequestBody UpdatePasswordRequest request)
    {
        try{
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            // password check
            if(isWeakPassword(request.getNewPassword())){
                return ResponseEntity.unprocessableEntity().build();
            }
            var user = repository.updatePassword(getAuthenticatedUserUsername(), request.getOldPassword(), request.getNewPassword());
            if(user != null){
                return ResponseEntity.ok("Password changed correctly.");
            }
            else {
                return ResponseEntity.internalServerError().build();
            }
        }
        catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        catch (BadCredentialsException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
    @PutMapping("/user/username")
    public ResponseEntity<LoginResponse> updateUsername(@Valid @RequestBody UpdateUsernameRequest request)
    {
        try{
            // check request
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            var username = wrapper.getAuthenticatedUserUsername();
            // if stored username doesn't match passed username
            if(!username.equals(request.getOldUsername()))
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
            var user = repository.updateUsername(username, request.getPassword(), request.getNewUsername());
            if(user != null){
                var jwtToken = jwtService.generateToken(user);
                return ResponseEntity.status(HttpStatus.OK).body(
                        LoginResponse.builder()
                                .token(jwtToken)
                                .user(
                                        UserInfoResponse.builder()
                                                .id(user.getId())
                                                .username(user.getUsername())
                                                .isFirstAccess(user.isFirstAccess())
                                                .role(user.getJobType())
                                                .activityId(user.getActivityId())
                                                .build())
                                .build());
            }
            else {
                return ResponseEntity.internalServerError().build();
            }
        }
        catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        catch (BadCredentialsException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        catch (DuplicateKeyException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/user")
    public  ResponseEntity<UserInfoResponse> getUserInfo(){
        try {
            var user = repository.findByUsername(getAuthenticatedUserUsername());
            if(user != null)
                return ResponseEntity.status(HttpStatus.OK).body(
                        UserInfoResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .isFirstAccess(user.isFirstAccess())
                                .role(user.getJobType())
                                .activityId(user.getActivityId())
                                .build());
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @PostMapping("/admins")
    public ResponseEntity<UserInfoResponse> createAdmin(@Valid @RequestBody AdminCredentials request)
    {
        try
        {
            // check request test only
            if(ControllerHelper.isRequestInvalid(request))
                return ResponseEntity.badRequest().build();
            // password check
            if(isWeakPassword(request.getAdminPassword())){
                return ResponseEntity.unprocessableEntity().build();
            }
            // request
            User admin = repository.createAdmin(
                    request.getAdminUsername(),
                    request.getAdminPassword());
            if (admin != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(
                        UserInfoResponse.builder()
                                .id(admin.getId())
                                .username(admin.getUsername())
                                .isFirstAccess(admin.isFirstAccess())
                                .role(admin.getJobType())
                                .activityId(admin.getActivityId())
                                .build());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }catch (DuplicateKeyException ex) {
            // Handle the unique constraint violation
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    public static String getErrorMessageFrom(UncategorizedSQLException exception)
    {
        String fullErrorMessage = exception.getCause().getLocalizedMessage();
        // Split the error message by newline character and keep the first line
        String[] lines = fullErrorMessage.split("\n");
        String firstLine = lines[0];
        // Remove "ERROR:" from the first line
        return firstLine.replace("ERROR: ", "");
    }

}
