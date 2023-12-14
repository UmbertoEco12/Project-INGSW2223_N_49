package com.projectApi.RatatouilleApi.UnitTests;

import com.projectApi.RatatouilleApi.JwtService;
import com.projectApi.RatatouilleApi.User.Controller.AuthController;
import com.projectApi.RatatouilleApi.User.Controller.AuthControllerWrapper;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import com.projectApi.RatatouilleApi.User.Request.UpdateUsernameRequest;
import com.projectApi.RatatouilleApi.User.Response.LoginResponse;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AuthControllerUpdateUsernameTest {
    @InjectMocks
    private AuthController authController;
    @Mock
    private AuthService repository;
    @Mock
    private AuthControllerWrapper authControllerWrapper;
    @Mock
    private JwtService jwtService;
    @Test
    public void testUpdateUsername_ValidRequest(){
        var request = createValidRequest();
        // Mock repository response
        var mockUser = createValidRepositoryResponse();
        var token = "mockedToken";
        var authUsername= "testOldUsername";
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        when(repository.updateUsername(request.getOldUsername(), request.getPassword(), request.getNewUsername())).thenReturn(mockUser);
        when(jwtService.generateToken(mockUser)).thenReturn(token);


        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);

        // Verify the interactions
        verify(repository).updateUsername(request.getOldUsername(), request.getPassword(), request.getNewUsername());
        verify(jwtService).generateToken(mockUser);
        // Assertions
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(token, responseEntity.getBody().getToken());
        assertEquals(mockUser.getUsername(), responseEntity.getBody().getUser().getUsername());
        assertEquals(mockUser.getJobType(), responseEntity.getBody().getUser().getRole());
        assertEquals(mockUser.getId(), responseEntity.getBody().getUser().getId());
        assertEquals(mockUser.getActivityId(), responseEntity.getBody().getUser().getActivityId());
        assertEquals(Boolean.valueOf(mockUser.isFirstAccess()), responseEntity.getBody().getUser().getIsFirstAccess());
    }

    @Test
    public void testUpdateUsername_InvalidRequest(){
        var request =new UpdateUsernameRequest("testOldUsername", null,null);
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }

    @Test
    public void testUpdateUsername_BlankUsername(){
        var request =new UpdateUsernameRequest("", "password","newUsername");
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }

    @Test
    public void testUpdateUsername_NullUsername(){
        var request =new UpdateUsernameRequest(null, "password","newUsername");
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }
    @Test
    public void testUpdateUsername_BlankNewUsername(){
        var request =new UpdateUsernameRequest("username", "password","");
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }
    @Test
    public void testUpdateUsername_NullNewUsername(){
        var request =new UpdateUsernameRequest("username", "password",null);
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }

    @Test
    public void testUpdateUsername_NullPassword(){
        var request =new UpdateUsernameRequest("username", null,"newUsername");
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }
    @Test
    public void testUpdateUsername_BlankPassword(){
        var request =new UpdateUsernameRequest("username", "","newUsername");
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }

    @Test
    public void testUpdateUsername_DatabaseConflictError() {
        // Simulate a database error scenario
        when(repository.updateUsername(any(), any(),any())).thenThrow(DuplicateKeyException.class);
        var authUsername= "testOldUsername";
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(createValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
    }
    @Test
    public void testUpdateUsername_DatabaseBadCredentialsError() {
        // Simulate a database error scenario
        when(repository.updateUsername(any(), any(),any())).thenThrow(BadCredentialsException.class);
        var authUsername= "testOldUsername";
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(createValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
    }
    @Test
    public void testUpdateUsername_UsernameNotFoundError() {
        // Simulate a database error scenario
        when(repository.updateUsername(any(), any(),any())).thenThrow(UsernameNotFoundException.class);
        var authUsername= "testOldUsername";
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(createValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
    }
    @Test
    public void testUpdateUsername_WrongOldUsername() {
        // Simulate a database error scenario
        var authUsername = "testOldUsername";
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        // Call the method to be tested
        ResponseEntity<LoginResponse> responseEntity = authController.updateUsername(new UpdateUsernameRequest("testDifferentUsername", "testPassword","testNewUsername"));

        // Assertions for database error scenario
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, responseEntity.getStatusCode());
    }
    private UpdateUsernameRequest createValidRequest() {

        return new UpdateUsernameRequest("testOldUsername", "testPassword","testNewUsername");
    }

    private User createValidRepositoryResponse(){
        return new User(2, 1, "testNewUsername", "encodedTestPassword", User.Authorities.ROLE_MANAGER, false);
    }
}
