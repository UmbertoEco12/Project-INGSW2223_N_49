CREATE OR REPLACE FUNCTION create_category(p_admin_username TEXT, p_category_name TEXT)
RETURNS Categories AS $$
DECLARE
    user_record Users;
	category Categories;
BEGIN
    SELECT * INTO user_record FROM Users WHERE Users.username = p_admin_username;
    
	-- Return the category if the creation is successful
    SELECT * INTO category FROM create_category(user_record.id, p_category_name);
	RETURN category;	
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_category(p_activity_id INT, p_category_name TEXT)
RETURNS Categories AS $$
DECLARE
    category_record Categories;
    category_order INT;
BEGIN

    SELECT Max(menu_order) INTO category_order
    FROM Categories WHERE admin_id = p_activity_id;
    IF category_order IS NULL THEN
        category_order := 0;
    END IF;
    category_order := category_order + 1;
    INSERT INTO Categories(admin_id, name, menu_order)
    VALUES(p_activity_id, clean_string(p_category_name), category_order)
    RETURNING * INTO category_record;
    -- Return the category if the creation is successful
    RETURN category_record;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_categories(p_activity_id INT)
RETURNS TABLE (
    id INT,
    name TEXT,
    menu_order INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.menu_order FROM Categories as c WHERE c.admin_id = p_activity_id
    ORDER BY c.menu_order;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_menu_category(p_username TEXT, p_category_id INT) 
RETURNS BOOLEAN
AS $$
DECLARE
user_record Users;
BEGIN
    SELECT * INTO user_record FROM Users WHERE Users.username = p_username;

    DELETE FROM Categories WHERE id = p_category_id AND admin_id = user_record.activity_id;

    IF NOT FOUND THEN
        -- Category not found, return false
        RETURN FALSE;
    END IF;

    -- Category found and deleted, return true
    RETURN TRUE;    
END;
$$ LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION delete_menu_category(p_activity_id INT, p_category_id INT) 
RETURNS BOOLEAN
AS $$
BEGIN

    DELETE FROM Categories WHERE id = p_category_id AND admin_id = p_activity_id;

    IF NOT FOUND THEN
        -- Category not found, return false
        RETURN FALSE;
    END IF;

    -- Category found and deleted, return true
    RETURN TRUE;    
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION update_categories_order(p_activity_id INT, p_category_orders CATEGORY_MENU_ORDER[])
RETURNS BOOLEAN AS $$
DECLARE
categories_updated BOOLEAN := true;
updated_category_id INT;
updated_menu_order INT;
BEGIN

    -- Loop through p_category_orders and update category orders
    FOREACH updated_category_id, updated_menu_order IN ARRAY p_category_orders
    LOOP
        -- Update the menu_order for the category
        UPDATE Categories
        SET menu_order = updated_menu_order
        WHERE Categories.id = updated_category_id AND admin_id = p_activity_id;

        -- Check if any row was affected
        IF NOT FOUND THEN
            categories_updated := false;
            EXIT;  -- Exit the loop if an update fails
        END IF;
    END LOOP;

    RETURN categories_updated;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_category(p_activity_id INT, p_category_id INT, p_new_category_name TEXT)
RETURNS Categories AS $$
DECLARE
    updated_category Categories;
BEGIN
    -- Update the category name and return the updated category
    UPDATE Categories
    SET name = clean_string(p_new_category_name)
    WHERE id = p_category_id
    AND admin_id = p_activity_id
    RETURNING * INTO updated_category;
    
    RETURN updated_category;
END;
$$ LANGUAGE plpgsql;