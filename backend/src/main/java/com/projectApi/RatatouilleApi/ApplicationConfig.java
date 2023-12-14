package com.projectApi.RatatouilleApi;

import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final AuthService service;
    @Bean
    public UserDetailsService userDetailsService(){
        return username -> {
            var user = service.findByUsername(username);
            if(user == null)
                throw new UsernameNotFoundException("User not found");
            return user;
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        return new UserAuthenticationProvider(service);
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception
    {
        return configuration.getAuthenticationManager();
    }

}
