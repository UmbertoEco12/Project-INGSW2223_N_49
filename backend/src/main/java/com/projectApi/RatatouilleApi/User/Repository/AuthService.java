package com.projectApi.RatatouilleApi.User.Repository;

import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Request.AdminCredentials;
import com.projectApi.RatatouilleApi.User.Request.UserCreationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthService {
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public User findByUsername(String username)
    {
        var res = jdbcTemplate.query("SELECT * FROM Users WHERE username = '%s'".formatted(username), (rs, rowNum) ->
            new User(
                    rs.getInt("id"),
                    rs.getInt("activity_id"),
                    rs.getString("username"),
                    rs.getString("password"),
                    rs.getString("job_type"),
                    rs.getBoolean("first_access")
            ));
        if(res.size() > 0)
            return res.get(0);
        else
            throw new UsernameNotFoundException("%s not found".formatted(username));
    }

    public User login(String username, String rawPassword) throws UncategorizedSQLException
    {
        var user = findByUsername(username);

        if(passwordEncoder.matches(rawPassword, user.getPassword()))
            return user;
        else
            throw new BadCredentialsException("Wrong password");
    }

    public User updatePassword(String username, String oldPassword, String newPassword){

        login(username, oldPassword);
        var password = passwordEncoder.encode(newPassword);
        // update password
        return jdbcTemplate.query("SELECT * FROM update_password('%s','%s')".formatted(username,password),
                (rs, rowNum) ->
                        new User(rs.getInt("id"),
                                rs.getInt("activity_id"),
                                rs.getString("username"),
                                rs.getString("password"),
                                rs.getString("job_type"),
                                rs.getBoolean("first_access")
                        )).get(0);
    }
    public User updateUsername(String username, String password, String newUsername){
        login(username, password);
        // update password
        return jdbcTemplate.query("SELECT * FROM update_username('%s','%s')".formatted(username,newUsername),
                (rs, rowNum) ->
                        new User(rs.getInt("id"),
                                rs.getInt("activity_id"),
                                rs.getString("username"),
                                rs.getString("password"),
                                rs.getString("job_type"),
                                rs.getBoolean("first_access")
                        )).get(0);
    }
    public User createAdmin(String username, String rawPassword)
    {
        var password = passwordEncoder.encode(rawPassword);
        var s = "SELECT * FROM create_admin('%s','%s')".formatted(
                username,password);
        return jdbcTemplate.query(s, (rs, rowNum) ->
                new User(
                        rs.getInt("id"),
                        rs.getInt("activity_id"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("job_type"),
                        rs.getBoolean("first_access")
                )).get(0);
    }
}
