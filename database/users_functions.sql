-- Create a function to create an admin and an activity
CREATE OR REPLACE FUNCTION create_admin(p_username TEXT, p_password TEXT)
RETURNS Users AS $$
DECLARE
    new_user Users;
    user_id INT;
BEGIN
    -- get next sequence value
    user_id = nextval('user_id_sequence');
    -- Use a unique constraint to ensure username uniqueness
    -- Insert a new user with job_type as 'admin'
    INSERT INTO Users (id,username, password, job_type)
    VALUES (user_id,p_username, p_password, 'admin')
    RETURNING * INTO new_user;

    -- Insert a new activity for the admin
    INSERT INTO Activities (id,activity_name, phone_number, address, icon)
    VALUES (user_id, 'Your Activity', '', '', '');

    -- Update the admin user with the activity_id
    UPDATE Users SET activity_id = user_id WHERE id = user_id;
    new_user.activity_id := new_user.id;
    -- Return the newly created user
    RETURN new_user;
END;
$$ LANGUAGE plpgsql;

-- Create a function to create a user associated with an admin by admin_id
CREATE OR REPLACE FUNCTION create_user(p_admin_id INT, p_username TEXT, p_password TEXT, p_job_type JOB_TYPE_ENUM)
RETURNS Users AS $$
DECLARE
    new_user Users;
BEGIN
    -- Insert a new user with the specified job_type and activity_id
    INSERT INTO Users (id, activity_id, username, password, job_type)
    VALUES (nextval('user_id_sequence'), p_admin_id, p_username, p_password, p_job_type)
    RETURNING * INTO new_user;

    -- Return the newly created user
    RETURN new_user;
END;
$$ LANGUAGE plpgsql;

-- Create a function to create a user associated with an admin by admin_id
CREATE OR REPLACE FUNCTION create_user(p_admin_username TEXT, p_username TEXT, p_password TEXT, p_job_type JOB_TYPE_ENUM)
RETURNS Users AS $$
DECLARE
    admin_user Users;
    new_user Users;
BEGIN
    SELECT * INTO admin_user FROM Users WHERE username = p_admin_username;
    -- Insert a new user with the specified job_type and activity_id
    INSERT INTO Users (id, activity_id, username, password, job_type)
    VALUES (nextval('user_id_sequence'), admin_user.id, p_username, p_password, p_job_type)
    RETURNING * INTO new_user;

    -- Return the newly created user
    RETURN new_user;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update password
CREATE OR REPLACE FUNCTION update_password(p_username TEXT, p_new_password TEXT)
RETURNS Users AS $$
DECLARE
    user_record Users;
BEGIN

    -- Update password
    UPDATE Users SET password = p_new_password, first_access = FALSE WHERE username = p_username
    RETURNING * INTO user_record;
    -- Return the user if the update is successful
    RETURN user_record;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update password
CREATE OR REPLACE FUNCTION update_username(p_old_username TEXT, p_new_username TEXT)
RETURNS Users AS $$
DECLARE
    user_record Users;
BEGIN
    -- Update password
    UPDATE Users SET username = p_new_username WHERE username = p_old_username
    RETURNING * INTO user_record;
    -- Return the user if the update is successful
    RETURN user_record;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_activity(p_admin_username TEXT)
RETURNS Activities AS $$
DECLARE
    user_record Users;
    activity Activities;
BEGIN
    SELECT * INTO user_record FROM Users WHERE username = p_admin_username;

    SELECT * INTO activity FROM Activities WHERE id = user_record.id;
    RETURN activity;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_activity(p_username TEXT,
 p_activity_name TEXT, p_phone_number TEXT, p_address TEXT)
RETURNS Activities AS $$
DECLARE
    user_record Users;
    activity Activities;
    a_name TEXT;
BEGIN
    SELECT * INTO user_record FROM Users WHERE username = p_username;
    
    a_name := 'Your Activity';
    IF p_activity_name <> '' THEN
        a_name := p_activity_name;
    END IF;
    -- Update activity
    UPDATE Activities SET 
    activity_name = a_name,
    phone_number = p_phone_number,
    address = p_address
    WHERE id = user_record.activity_id
    RETURNING * INTO activity;

    RETURN activity;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_icon(p_username TEXT, p_icon TEXT)
RETURNS Activities AS $$
DECLARE
    user_record Users;
    activity Activities;
    a_name TEXT;
BEGIN
    SELECT * INTO user_record FROM Users WHERE username = p_username;
    
    -- Update activity icon
    UPDATE Activities SET
    icon = p_icon
    WHERE id = user_record.activity_id
    RETURNING * INTO activity;

    RETURN activity;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_staff(p_admin_username TEXT)
RETURNS TABLE (
    id INT,
    username TEXT,
    job_type JOB_TYPE_ENUM
) AS $$
DECLARE
    user_record Users;
BEGIN
    SELECT * INTO user_record FROM Users WHERE Users.username = p_admin_username;

    RETURN QUERY
    SELECT u.id, u.username, u.job_type
    FROM Users as u
    WHERE u.activity_id = user_record.activity_id AND u.job_type <> 'admin'
    ORDER BY (u.job_type <> 'manager'), u.job_type;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_staff(p_admin_username TEXT, p_user_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record Users;
BEGIN
    -- Check if username and password are correct
    SELECT * INTO user_record FROM Users WHERE Users.username = p_admin_username;
    -- can`t delete itself
    DELETE FROM Users WHERE id = p_user_id AND activity_id = user_record.id AND username <> p_admin_username;

    IF NOT FOUND THEN
        -- User not found, return false
        RETURN FALSE;
    END IF;

    -- User found and deleted, return true
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

