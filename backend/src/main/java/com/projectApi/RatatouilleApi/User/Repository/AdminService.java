package com.projectApi.RatatouilleApi.User.Repository;

import com.projectApi.RatatouilleApi.Helper.BaseService;
import com.projectApi.RatatouilleApi.User.Data.Activity;
import com.projectApi.RatatouilleApi.User.Data.User;
import com.projectApi.RatatouilleApi.User.Data.UserStaff;
import com.projectApi.RatatouilleApi.User.Request.AdminCredentials;
import com.projectApi.RatatouilleApi.User.Request.UpdateActivityRequest;
import com.projectApi.RatatouilleApi.User.Request.UserLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminService {
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    public UserStaff createUser(String adminUsername, String username, String rawPassword, String jobType){
        final String password = passwordEncoder.encode(rawPassword);
        return jdbcTemplate.query("SELECT * FROM create_user('%s','%s','%s','%s')"
                        .formatted(adminUsername, username, password, jobType),
                (rs, rowNum) ->
                        new UserStaff(
                                rs.getInt("id"),
                                rs.getString("username"),
                                rs.getString("job_type")
                        )).get(0);
    }

    public boolean deleteUser(String adminUsername, Integer userId){
        return jdbcTemplate.query("SELECT * FROM delete_staff('%s',%d)"
                        .formatted(adminUsername, userId),
                (rs, rowNum) -> rs.getBoolean(1)).get(0);
    }

    public List<UserStaff> getStaff(String adminUsername)
    {
        return jdbcTemplate.query("SELECT * FROM get_staff('%s')".formatted(adminUsername),
                (rs, rowNum) ->
                        new UserStaff(
                                rs.getInt("id"),
                                rs.getString("username"),
                                rs.getString("job_type")
                        ));
    }

    public Activity getActivity(String adminUsername)
    {
        return jdbcTemplate.query("SELECT * FROM get_activity('%s')".formatted(adminUsername),
                (rs, rowNum) ->
                        new Activity(
                                rs.getInt("id"),
                                rs.getString("activity_name"),
                                rs.getString("phone_number"),
                                rs.getString("address"),
                                rs.getString("icon")
                        )).get(0);
    }

    public Activity updateActivity(String adminUsername, String activityName, String address, String phoneNumber)
    {
        return jdbcTemplate.query("SELECT * FROM update_activity('%s', '%s','%s','%s')".formatted(
                adminUsername, activityName, phoneNumber, address),
                (rs, rowNum) ->
                        new Activity(
                                rs.getInt("id"),
                                rs.getString("activity_name"),
                                rs.getString("phone_number"),
                                rs.getString("address"),
                                rs.getString("icon")
                        )).get(0);
    }

    public Activity updateActivityIcon(String username, String iconPath){
        return jdbcTemplate.query("SELECT * FROM update_icon('%s', '%s')".formatted(username, iconPath),
                (rs, rowNum) ->
                        new Activity(
                                rs.getInt("id"),
                                rs.getString("activity_name"),
                                rs.getString("phone_number"),
                                rs.getString("address"),
                                rs.getString("icon")
                        )).get(0);
    }

}
