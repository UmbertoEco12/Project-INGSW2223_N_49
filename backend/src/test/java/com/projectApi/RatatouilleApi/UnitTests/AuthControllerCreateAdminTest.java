package com.projectApi.RatatouilleApi.UnitTests;

import com.projectApi.RatatouilleApi.User.Controller.AuthController;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import com.projectApi.RatatouilleApi.User.Request.AdminCredentials;
import com.projectApi.RatatouilleApi.User.Response.UserInfoResponse;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AuthControllerCreateAdminTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthService repository;


    @Test
    public void testCreateAdmin_ValidRequest(){
        var request = createValidRequest();
        // Mock repository response
        var mockAdmin = createValidAdmin();
        when(repository.createAdmin(request.getAdminUsername(), request.getAdminPassword())).thenReturn(mockAdmin);

        // Call the method to be tested
        ResponseEntity<UserInfoResponse> responseEntity = authController.createAdmin(request);

        // Verify the interactions
        verify(repository).createAdmin(request.getAdminUsername(), request.getAdminPassword());

        // Assertions
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(mockAdmin.getId(), responseEntity.getBody().getId());
        assertEquals(mockAdmin.getUsername(), responseEntity.getBody().getUsername());
    }

    @Test
    public void testCreateAdmin_InvalidRequest(){
        var request =new AdminCredentials("testAdmin", null);
        // Call the method to be tested
        ResponseEntity<UserInfoResponse> responseEntity = authController.createAdmin(request);

        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
    }
    @Test
    public void testCreateAdmin_WeakPassword(){
        var request =new AdminCredentials("testAdmin", "weakPassword");
        // Call the method to be tested
        ResponseEntity<UserInfoResponse> responseEntity = authController.createAdmin(request);

        // Assertions
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, responseEntity.getStatusCode());
    }
    @Test
    public void testCreateAdmin_DatabaseError() {
        // Simulate a database error scenario
        when(repository.createAdmin(any(), any())).thenThrow(DuplicateKeyException.class);

        // Call the method to be tested
        ResponseEntity<UserInfoResponse> responseEntity = authController.createAdmin(createValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
    }

    @Test
    public void testCreateAdmin_AdminCreationFailure() {
        // Simulate an admin creation failure scenario
        when(repository.createAdmin(any(), any())).thenReturn(null);

        // Call the method to be tested
        ResponseEntity<UserInfoResponse> responseEntity = authController.createAdmin(createValidRequest());

        // Assertions for admin creation failure scenario
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
    }

    // Helper methods for creating valid input
    private AdminCredentials createValidRequest() {
        return new AdminCredentials("testAdmin", "testPassword1");
    }

    private User createValidAdmin() {
        return new User(1, 1, "testAdmin", "encodedTestPassword", User.Authorities.ROLE_ADMIN, true);
    }
}
