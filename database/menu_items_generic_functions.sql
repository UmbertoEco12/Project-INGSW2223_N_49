-- removes the item from the passed category
CREATE OR REPLACE FUNCTION remove_item_from_category(p_activity_id INT, p_item_id INT, p_category_id INT)
RETURNS TABLE (
    id INT,
    name TEXT,
    foreign_name TEXT,
    price DECIMAL,
    description TEXT,
    foreign_description TEXT,
	ready_to_serve BOOLEAN,
    categories JSON,
    allergens TEXT[],
    ingredients TEXT[],
    choices JSON,
    custom_changes TEXT[]
) AS $$
DECLARE
    category_record Categories;
BEGIN
    -- remove item-category relationship
    DELETE FROM MenuItemsCategories 
    WHERE menu_item_id = p_item_id AND category_id = p_category_id;
    
    -- Return the newly created menu item
    RETURN QUERY SELECT * FROM get_menu_item(p_activity_id, p_item_id);
END;
$$ LANGUAGE plpgsql;

-- adds the item to the passed category
CREATE OR REPLACE FUNCTION add_item_to_category(p_activity_id INT, p_item_id INT, p_category_id INT)
RETURNS TABLE (
    id INT,
    name TEXT,
    foreign_name TEXT,
    price DECIMAL,
    description TEXT,
    foreign_description TEXT,
	ready_to_serve BOOLEAN,
    categories JSON,
    allergens TEXT[],
    ingredients TEXT[],
    choices JSON,
    custom_changes TEXT[]
) AS $$
DECLARE
    category_record Categories;
    item_order INT;
BEGIN
    -- get max order
    SELECT Max(mi.item_order) INTO item_order
    FROM MenuItemsCategories as mi WHERE category_id = p_category_id;
    IF item_order IS NULL THEN
        item_order := 0;
    END IF;
    item_order := item_order + 1;
    
    -- add item-category relationship
    INSERT INTO MenuItemsCategories(menu_item_id, category_id, item_order)
    VALUES(p_item_id, p_category_id, item_order);

    -- Return the newly created menu item
    RETURN QUERY SELECT * FROM get_menu_item(p_activity_id, p_item_id);
END;
$$ LANGUAGE plpgsql;




-- deletes the item
CREATE OR REPLACE FUNCTION delete_menu_item(p_activity_id INT, p_item_id INT) 
RETURNS BOOLEAN
AS $$
BEGIN

    DELETE FROM MenuItems WHERE id = p_item_id AND activity_id = p_activity_id;

    IF NOT FOUND THEN
        -- Item not found, return false
        RETURN FALSE;
    END IF;

    -- Item found and deleted, return true
    RETURN TRUE;
    
END;
$$ LANGUAGE PLPGSQL;

-- update the order of the items on the selected category
CREATE OR REPLACE FUNCTION update_menu_item_orders(p_activity_id INT, p_orders ITEM_UPDATE_CATEGORY_ORDER[], p_category_id INT)
RETURNS BOOLEAN AS $$
DECLARE
orders_updated BOOLEAN := true;
updated_item_id INT;
updated_item_order INT;
BEGIN

    -- Loop through p_category_orders and update category orders
    FOREACH updated_item_id, updated_item_order IN ARRAY p_orders
    LOOP
        -- Update the menu_order for the category
        UPDATE MenuItemsCategories
        SET item_order = updated_item_order
        WHERE category_id = p_category_id AND menu_item_id = updated_item_id;

        -- Check if any row was affected
        IF NOT FOUND THEN
            orders_updated := false;
            EXIT;  -- Exit the loop if an update fails
        END IF;
    END LOOP;

    RETURN orders_updated;
END;
$$ LANGUAGE plpgsql;