package com.projectApi.RatatouilleApi;

import com.projectApi.RatatouilleApi.User.Data.User;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {"/auth/login", "/admins","/icon/**","/ratatouille-websocket/**"};
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
    {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()
                                // admins
                                .requestMatchers("/admins/*", "/admins/upload").hasAuthority(User.Authorities.ROLE_ADMIN)
                                // menu
                                .requestMatchers(GET, "/menu/categories", "/menu/items").authenticated()
                                .requestMatchers("/menu/*").hasAnyAuthority(User.Authorities.ROLE_MANAGER, User.Authorities.ROLE_ADMIN)
                                // orders
                                .requestMatchers(GET, "/orders").hasAnyAuthority(User.Authorities.ROLE_MANAGER, User.Authorities.ROLE_WAITER, User.Authorities.ROLE_CHEF)
                                .requestMatchers(POST, "/orders").hasAuthority(User.Authorities.ROLE_WAITER)
                                .requestMatchers(PUT, "/orders/{orderId}").hasAuthority(User.Authorities.ROLE_WAITER)
                                .requestMatchers(PUT, "/orders/{orderItemId}/{status}").hasAuthority(User.Authorities.ROLE_CHEF)
                                .requestMatchers(DELETE, "/orders/{orderId}").hasAuthority(User.Authorities.ROLE_MANAGER)
                                // others
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }
}
