CREATE OR REPLACE FUNCTION create_menu_item(p_admin_username TEXT, p_category_name TEXT,
 p_item_name TEXT, p_item_price DECIMAL, p_item_description TEXT, p_item_allergens TEXT[], 
 p_foreign_name TEXT,p_foreign_description TEXT, p_ready_to_serve BOOLEAN,
 -- item ingredients
 p_item_ingredients TEXT[],
 -- choice types
 p_item_choices ITEM_CHOICE_GROUP[],
 -- custom or popular changes
 p_item_changes TEXT[]
 )
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
    user_record Users;
    category_record Categories;
BEGIN
    -- create item
    SELECT * INTO user_record FROM Users WHERE Users.username = p_admin_username;
    SELECT * INTO category_record FROM Categories WHERE Categories.name = lower(p_category_name);
    -- Return the newly created menu item
    RETURN QUERY SELECT * FROM create_menu_item(user_record.id, Array[(category_record.id)],
 p_item_name, p_item_price, p_item_description, p_item_allergens, 
 p_foreign_name,p_foreign_description, p_ready_to_serve,
 -- item ingredients
 p_item_ingredients,
 -- choice types
 p_item_choices,
 -- custom or popular changes
 p_item_changes);
END;
$$ LANGUAGE plpgsql;

-- Create a new menu item
CREATE OR REPLACE FUNCTION create_menu_item(p_activity_id INT, p_item_categories INT[],
 p_item_name TEXT, p_item_price DECIMAL, p_item_description TEXT, p_item_allergens TEXT[], 
 p_foreign_name TEXT,p_foreign_description TEXT, p_ready_to_serve BOOLEAN,
 -- item ingredients
 p_item_ingredients TEXT[],
 -- choice types
 p_item_choices ITEM_CHOICE_GROUP[],
 -- custom or popular changes
 p_item_changes TEXT[]
 )
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
    menu_item MenuItems;
    allergen_id INT;
	allergen_name TEXT;
    category_id INT;
    item_order INT;
BEGIN
    -- create item
    INSERT INTO MenuItems(name, price, description, activity_id,foreign_name, foreign_description, ready_to_serve)
    VALUES(clean_string(p_item_name), p_item_price, p_item_description, p_activity_id, clean_string(p_foreign_name), p_foreign_description, p_ready_to_serve)
    RETURNING * INTO menu_item;

    -- add categories
    FOREACH category_id IN ARRAY p_item_categories
    LOOP
        PERFORM add_item_to_category(p_activity_id, menu_item.id, category_id);    
    END LOOP;    

    -- add allergens 
    CALL replace_menu_item_allergens(menu_item.id, p_item_allergens);
    -- add ingredients
    CALL replace_menu_item_ingredients(menu_item.id, p_item_ingredients);
    -- add choices
    CALL replace_menu_item_choices(menu_item.id, p_item_choices);
    -- add changes
    CALL replace_menu_item_ingredients_changes(menu_item.id, p_item_changes);
    -- Return the newly created menu item
    RETURN QUERY SELECT * FROM get_menu_item(p_activity_id, menu_item.id);
END;
$$ LANGUAGE plpgsql;

-- update the menu item values (doesn t change categories)
CREATE OR REPLACE FUNCTION update_menu_item(p_activity_id INT, p_item_id INT,
 p_new_item_name TEXT, p_new_item_price DECIMAL, p_new_item_description TEXT, 
 p_new_item_allergens TEXT[], 
 p_new_foreign_name TEXT, 
 p_new_foreign_description TEXT, p_ready_to_serve BOOLEAN,
  -- item ingredients
 p_item_ingredients TEXT[],
 -- choice types
 p_item_choices ITEM_CHOICE_GROUP[],
 -- custom or popular changes
 p_item_changes TEXT[])
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
BEGIN
    -- Update the menu item itself
    UPDATE MenuItems
    SET
        name = clean_string(p_new_item_name),
        price = p_new_item_price,
        description = p_new_item_description,
        foreign_name = clean_string(p_new_foreign_name),
        foreign_description = p_new_foreign_description,
        ready_to_serve = p_ready_to_serve
    WHERE MenuItems.id = p_item_id AND activity_id = p_activity_id;

    -- add allergens
    CALL replace_menu_item_allergens(p_item_id, p_new_item_allergens);
     -- add ingredients
    CALL replace_menu_item_ingredients(p_item_id, p_item_ingredients);
    -- add choices
    CALL replace_menu_item_choices(p_item_id, p_item_choices);
    -- add changes
    CALL replace_menu_item_ingredients_changes(p_item_id, p_item_changes);
    -- Return the newly created menu item
    RETURN QUERY SELECT * FROM get_menu_item(p_activity_id, p_item_id);
END;
$$ LANGUAGE plpgsql;

