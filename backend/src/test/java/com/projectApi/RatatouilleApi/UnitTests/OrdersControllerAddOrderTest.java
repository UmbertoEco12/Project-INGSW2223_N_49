package com.projectApi.RatatouilleApi.UnitTests;

import com.projectApi.RatatouilleApi.Orders.Controller.OrdersController;
import com.projectApi.RatatouilleApi.Orders.Data.Order;
import com.projectApi.RatatouilleApi.Orders.Data.OrderItemCreation;
import com.projectApi.RatatouilleApi.Orders.Repository.OrdersService;
import com.projectApi.RatatouilleApi.Orders.Request.CreateOrderRequest;
import com.projectApi.RatatouilleApi.Orders.Response.CreateOrderTopicMessage;
import com.projectApi.RatatouilleApi.User.Controller.AuthControllerWrapper;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Locale;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNull;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class OrdersControllerAddOrderTest {

    @InjectMocks
    private OrdersController controller;
    @Mock
    private OrdersService repository;
    @Mock
    private AuthService authRepository;
    @Mock
    private AuthControllerWrapper authControllerWrapper;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Test
    public void testAddOrder_ValidRequest(){
        var request = getValidRequest();
        var authUsername= "authUsername";
        // Mock get AuthenticatedUser
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        // Mock repository response
        //var mockUser = createValidUser(User.Authorities.ROLE_MANAGER);
        var mockOrder =getValidOrder();
        when(repository.createOrder(1,1,request.getTableNumber(), request.getPeopleNumber(),request.getItems()))
                .thenReturn(mockOrder);
        var mockUser = User.builder().id(1).activityId(1).username(authUsername).build();
        when(authRepository.findByUsername(authUsername)).thenReturn(mockUser);
        // Call the method to be tested
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Verify the interactions
        var msgMock = CreateOrderTopicMessage.builder()
                .message(OrdersController.OrdersOperations.Add.toString().toLowerCase(Locale.ROOT))
                .item(mockOrder).build();
        verify(messagingTemplate).convertAndSend(OrdersController.TOPIC_DESTINATION_PREFIX + "1",msgMock);
        verify(authRepository).findByUsername(authUsername);
        verify(repository).createOrder(1,1,request.getTableNumber(), request.getPeopleNumber(),request.getItems());
        // Assertions
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(responseEntity.getBody(), mockOrder);
    }

    @Test
    public void testAddOrder_NullTableNumber(){
        // Mock input
        var request = getValidRequest();
        request.setTableNumber(null);
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testAddOrder_NegativeTableNumber(){
        // Mock input
        var request = getValidRequest();
        request.setTableNumber(-1);
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testAddOrder_NegativePeopleNumber(){
        // Mock input
        var request = getValidRequest();
        request.setPeopleNumber(-1);
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testAddOrder_NullPeopleNumber(){
        // Mock input
        var request = getValidRequest();
        request.setPeopleNumber(null);
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testAddOrder_NullItems(){
        // Mock input
        var request = getValidRequest();
        request.setItems(null);
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testAddOrder_EmptyItems(){
        // Mock input
        var request = getValidRequest();
        request.setItems(new OrderItemCreation[]{});
        ResponseEntity<Order> responseEntity = controller.addOrder(request);
        // Assertions
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }
    @Test
    public void testAddOrder_DatabaseConflictError() {
        // Simulate a database error scenario
        when(repository.createOrder(any(),any(), any(),any(),any())).thenThrow(DuplicateKeyException.class);
        var authUsername= "authUsername";
        // Mock get AuthenticatedUser
        when(authControllerWrapper.getAuthenticatedUserUsername()).thenReturn(authUsername);
        var mockUser = User.builder().id(1).activityId(1).username(authUsername).build();
        when(authRepository.findByUsername(authUsername)).thenReturn(mockUser);
        // Call the method to be tested
        ResponseEntity<Order> responseEntity = controller.addOrder(getValidRequest());

        // Assertions for database error scenario
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
    }
    public Order getValidOrder(){
        return Order.builder().userId(1).activityId(1).build();
    }
    public CreateOrderRequest getValidRequest(){
        var item = OrderItemCreation.builder()
                .itemId(1)
                .orderGroupId(1)
                .customChanges(new String[]{})
                .ingredientsRemoved(new String[]{})
                .preparationChoices(new String[]{})
                .status("to_prepare")
                .notes("")
                .build();
        var items = new OrderItemCreation[]{ item };
        return new CreateOrderRequest(1,1,items);
    }
}
