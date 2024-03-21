package com.projectApi.RatatouilleApi.UnitTests;

import com.projectApi.RatatouilleApi.User.Controller.AdminController;
import com.projectApi.RatatouilleApi.User.Controller.AuthControllerWrapper;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Data.UserStaff;
import com.projectApi.RatatouilleApi.User.Repository.AdminService;
import com.projectApi.RatatouilleApi.User.Request.UserCreationRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNull;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AdminControllerCreateUserTest {
    @InjectMocks
    private AdminController controller;
    @Mock
    private AdminService repository;
    @Mock
    private AuthControllerWrapper authControllerWrapper;

    @Test
    public void testCreateUser_ValidInput() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", "validPassword1", User.Authorities.ROLE_MANAGER);
        var authUsername= "authUsername";
        // Mock get AuthenticatedUser
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        // Mock repository response
        var mockUser = createValidUser(User.Authorities.ROLE_MANAGER);
        when(repository.createUser(authUsername,request.getUsername(), request.getPassword(),request.getRole())).thenReturn(mockUser);
        // Call the method to be tested
        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);
        // Verify the interactions
        verify(repository).createUser(authUsername,request.getUsername(), request.getPassword(),request.getRole());

        // Assertions
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(mockUser.getId(), responseEntity.getBody().getId());
        assertEquals(mockUser.getUsername(), responseEntity.getBody().getUsername());
        assertEquals(mockUser.getRole(), responseEntity.getBody().getRole());
    }
    @Test
    public void testCreateUser_NullPassword() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", null, User.Authorities.ROLE_MANAGER);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_BlankPassword() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", "", User.Authorities.ROLE_MANAGER);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_WeakPassword() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", "weakPassword", User.Authorities.ROLE_MANAGER);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_BlankUsername() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("", "validPassword1", User.Authorities.ROLE_MANAGER);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_NullUsername() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest(null, "validPassword1", User.Authorities.ROLE_MANAGER);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_InvalidRole() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", "validPassword1", User.Authorities.ROLE_ADMIN);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.FORBIDDEN, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_NullRole() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", "validPassword1", null);

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_BlankRole() {
        // Mock input
        UserCreationRequest request = new UserCreationRequest("validUsername", "validPassword1", "");

        ResponseEntity<UserStaff> responseEntity = controller.createUser(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testCreateUser_DatabaseConflictError() {
        // Simulate a database error scenario
        when(repository.createUser(any(),any(), any(),any())).thenThrow(DuplicateKeyException.class);

        // Call the method to be tested
        ResponseEntity<UserStaff> responseEntity = controller.createUser(createValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
    }
    @Test
    public void testCreateUser_DatabaseDataIntegrityViolationError() {
        // Simulate a database error scenario
        when(repository.createUser(any(),any(), any(),any())).thenThrow(DataIntegrityViolationException.class);

        // Call the method to be tested
        ResponseEntity<UserStaff> responseEntity = controller.createUser(createValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, responseEntity.getStatusCode());
    }


    private UserCreationRequest createValidRequest(){
        return new UserCreationRequest("validUsername", "validPassword1", User.Authorities.ROLE_MANAGER);
    }
    private UserStaff createValidUser(String role) {
        return new UserStaff(1, "testAdmin", role);
    }
}
