package com.projectApi.RatatouilleApi;

import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

@RequiredArgsConstructor
public class UserAuthenticationProvider implements AuthenticationProvider {

    public static class UserDetails{
        private Boolean firstAccess;
        private Integer activityId;
    }
    private final AuthService service;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName(); // Get the username
        String password = authentication.getCredentials().toString();// Get the password
        var user = service.login(username, password); // try login
        if(user != null)
        {
            UsernamePasswordAuthenticationToken authResult =
                    new UsernamePasswordAuthenticationToken(username, password, authentication.getAuthorities());
            authResult.setDetails(user);

            return authResult;
        }
        else {
            // If authentication fails, throw a BadCredentialsException
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
