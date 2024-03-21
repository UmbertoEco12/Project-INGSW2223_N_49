-----TYPES-----


-- user role
DO $$ BEGIN
    CREATE TYPE JOB_TYPE_ENUM AS ENUM ('admin', 'manager', 'chef', 'waiter');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- item order (return type)
DO $$ BEGIN
    CREATE TYPE ITEM_CATEGORY_ORDER AS (category_id INT, item_order INT);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- item choice group
DO $$ BEGIN
    CREATE TYPE ITEM_CHOICE_GROUP AS (group_name TEXT, choices TEXT[]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE CATEGORY_MENU_ORDER AS (category_id INT, menu_order INT);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- order status
DO $$ BEGIN
    CREATE TYPE ORDER_STATUS AS ENUM ('to_prepare', 'to_serve', 'served', 'waiting', 'preparing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- item order update
DO $$ BEGIN
    CREATE TYPE ITEM_ORDER_UPDATE AS (
    order_item_id INT,
    order_group_id INT,
    status ORDER_STATUS,
    notes TEXT,
    is_canceled BOOLEAN
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- item order
DO $$ BEGIN
    CREATE TYPE ITEM_ORDER_CREATION AS (
    item_id INT,
    preparation_choices TEXT[],
    custom_changes TEXT[],
    ingredients_removed TEXT[],
    order_group_id INT,
    status ORDER_STATUS,
    notes TEXT
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- item order (to update)
DO $$ BEGIN
    CREATE TYPE ITEM_UPDATE_CATEGORY_ORDER AS (item_id INT, item_order INT);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

----TABLES-----


-- Create the "Activities" table
CREATE TABLE IF NOT EXISTS Activities (
    id INT PRIMARY KEY,
    activity_name TEXT,
    phone_number TEXT,
    address TEXT,
    icon TEXT
);
-- Create a custom sequence for user id
CREATE SEQUENCE IF NOT EXISTS user_id_sequence;
-- Create the "Users" table
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY,
    activity_id INT REFERENCES Activities(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    password TEXT,
    job_type JOB_TYPE_ENUM,
    first_access BOOLEAN DEFAULT true
);

-- Create the "Category" table
CREATE TABLE IF NOT EXISTS Categories (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES Activities(id) ON DELETE CASCADE,
    name TEXT,
    menu_order INT
);

-- Create the "MenuItems" table
CREATE TABLE IF NOT EXISTS MenuItems (
    id SERIAL PRIMARY KEY,
    name TEXT,
    foreign_name TEXT,
    price DECIMAL,
    description TEXT,
    foreign_description TEXT,
    ready_to_serve BOOLEAN,
    activity_id INT REFERENCES Activities(id) ON DELETE CASCADE
);
-- relation between categories and menu items
CREATE TABLE IF NOT EXISTS MenuItemsCategories
(
    menu_item_id INT REFERENCES MenuItems(id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
    item_order INT
);
-- Create the "Allergens" table
CREATE TABLE IF NOT EXISTS Allergens
(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);
-- relation between allergens and menu items
CREATE TABLE IF NOT EXISTS MenuItemsAllergens
(
    menu_item_id INT REFERENCES MenuItems(id) ON DELETE CASCADE,
    allergen_id INT REFERENCES Allergens(id),
    item_order INT,
    PRIMARY KEY(menu_item_id, allergen_id)
);

-- ingredients table
CREATE TABLE IF NOT EXISTS Ingredients
(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

-- which items are needed for the item
CREATE TABLE IF NOT EXISTS MenuItemsIngredients
(
    menu_item_id INT REFERENCES MenuItems(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES Ingredients(id) ON DELETE CASCADE,
    item_order INT,
    PRIMARY KEY(menu_item_id, ingredient_id)
);
-- all ingredients used by that activity (added automatically when added on the item)
-- create trigger that adds automatically ingredients from items to activity.
CREATE TABLE IF NOT EXISTS ActivityIngredients
(
    activity_id INT REFERENCES Activities(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES Ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY(activity_id, ingredient_id)
);

-- item preparation choices
-- (item quantities, item cooking type, ...)
CREATE TABLE IF NOT EXISTS PreparationChoices
(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

-- item preparation choices groups
-- (item quantities, item cooking type, ...)
-- plus a name identifying the choice (Quantity, Cooking type, ...)
-- reference to the item
-- to add no selection add a none option as default.
CREATE TABLE IF NOT EXISTS MenuItemsChoiceGroups
(
    id SERIAL PRIMARY KEY,
    name TEXT,
    menu_item_id INT REFERENCES MenuItems(id) ON DELETE CASCADE
);

-- relation between choices and choice-groups.
CREATE TABLE IF NOT EXISTS PreparationChoicesGroups
(
    group_id INT REFERENCES MenuItemsChoiceGroups(id) ON DELETE CASCADE,
    choice_id INT REFERENCES PreparationChoices(id) ON DELETE CASCADE,
    item_order INT,
    PRIMARY KEY(group_id, choice_id)
);


-- handles custom adding ingredients.
CREATE TABLE IF NOT EXISTS IngredientChanges
(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);
-- relation between changes and menu items
CREATE TABLE IF NOT EXISTS MenuItemsIngredientsChanges
(
    menu_item_id INT REFERENCES MenuItems(id) ON DELETE CASCADE,
    change_id INT REFERENCES IngredientChanges(id) ON DELETE CASCADE,
    item_order INT,
    PRIMARY KEY(menu_item_id, change_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS UserOrders
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    activity_id INT REFERENCES Activities(id) ON DELETE CASCADE,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Orders
CREATE TABLE IF NOT EXISTS OrderItems
(
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES UserOrders(id) ON DELETE CASCADE,
    item_id INT REFERENCES MenuItems(id) ON DELETE CASCADE,
    preparation_choices TEXT[],
    custom_changes TEXT[],
    ingredients_removed TEXT[],
    order_group_id INT, -- updatable (groups the items with same id)
    status ORDER_STATUS, -- updatable
    notes TEXT, -- updatable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_canceled BOOLEAN DEFAULT FALSE -- updatable
);

----------TRIGGERS-----------

-- drop constraint
ALTER TABLE MenuItemsAllergens
DROP CONSTRAINT IF EXISTS unique_menu_item_allergen;
-- Add a unique constraint to the Category table
ALTER TABLE MenuItemsAllergens
ADD CONSTRAINT unique_menu_item_allergen
UNIQUE (menu_item_id, allergen_id);

-- drop constraint
ALTER TABLE MenuItems
DROP CONSTRAINT IF EXISTS unique_menu_item_name_activity;
-- Add a unique constraint to the Category table
ALTER TABLE MenuItems
ADD CONSTRAINT unique_menu_item_name_activity
UNIQUE (name, activity_id);

-- drop constraint
ALTER TABLE MenuItemsCategories 
DROP CONSTRAINT IF EXISTS unique_menu_item_category;
-- Add a unique constraint to the Category table
ALTER TABLE MenuItemsCategories
ADD CONSTRAINT unique_menu_item_category
UNIQUE (menu_item_id, category_id);

-- drop constraint
ALTER TABLE Categories 
DROP CONSTRAINT IF EXISTS unique_category_name_admin;
-- Add a unique constraint to the Category table
ALTER TABLE Categories
ADD CONSTRAINT unique_category_name_admin
UNIQUE (name, admin_id);


-- drop constraint
ALTER TABLE UserOrders
DROP CONSTRAINT IF EXISTS unique_table_order;
-- Add a unique constraint to the User Orders table
ALTER TABLE UserOrders
ADD CONSTRAINT unique_table_order
UNIQUE (activity_id, table_number);

-- Create a trigger to remove the associated item after deleting the category
CREATE OR REPLACE FUNCTION delete_menu_item_if_no_categories()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM MenuItemsCategories
        WHERE menu_item_id = OLD.menu_item_id
    ) THEN
        DELETE FROM MenuItems WHERE id = OLD.menu_item_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trigger_delete_menu_item ON MenuItemsCategories;
DO $$ BEGIN
    -- Create the trigger to be fired after ItemsCategories deletion
    CREATE TRIGGER trigger_delete_menu_item
    AFTER DELETE ON MenuItemsCategories
    FOR EACH ROW
    EXECUTE FUNCTION delete_menu_item_if_no_categories();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create a trigger to remove the associated activity after deleting an admin user
CREATE OR REPLACE FUNCTION remove_activity_on_admin_delete()
RETURNS TRIGGER AS $$
BEGIN    
    -- Check if the deleted user is an admin
    IF OLD.job_type = 'admin' THEN
        -- Delete the associated activity
        -- activity will remove everything else
        DELETE FROM Activities WHERE id = OLD.activity_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    -- Create the trigger to be fired after user deletion
    CREATE TRIGGER trigger_remove_activity_on_admin_delete
    AFTER DELETE ON Users
    FOR EACH ROW
    EXECUTE FUNCTION remove_activity_on_admin_delete();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
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
CREATE OR REPLACE FUNCTION clean_string(p_original_string TEXT)
RETURNS TEXT
AS $$
DECLARE
    cleaned_string TEXT;
BEGIN
    -- Remove leading and trailing spaces and replace consecutive spaces with a single space
    cleaned_string := REGEXP_REPLACE(TRIM(BOTH ' ' FROM p_original_string), ' +', ' ');

    -- Return the cleaned string
    RETURN lower(cleaned_string);
END;
$$ LANGUAGE plpgsql;
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

-- returns all items of an activity
CREATE OR REPLACE FUNCTION get_menu_items(p_activity_id INT)
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
    RETURN QUERY
    SELECT 
    mi.id, 
    mi.name, 
    mi.foreign_name, 
    mi.price, 
    mi.description, 
    mi.foreign_description,
	mi.ready_to_serve,
    to_json(array_agg(DISTINCT ROW(c.id, mic.item_order)::ITEM_CATEGORY_ORDER)) 
    AS categories,
	(
		SELECT array_agg(i.name ORDER BY mi_ing.item_order)
		FROM MenuItemsAllergens AS mi_ing
		LEFT JOIN Allergens AS i ON mi_ing.allergen_id = i.id
		WHERE mi.id = mi_ing.menu_item_id
	) As allergens,    
	(
		SELECT array_agg(i.name ORDER BY mi_ing.item_order)
		FROM MenuItemsIngredients AS mi_ing
		LEFT JOIN Ingredients AS i ON mi_ing.ingredient_id = i.id
		WHERE mi.id = mi_ing.menu_item_id
	) As ingredients,
    to_json((
        SELECT 
			array_agg(
				ROW(cg.name, choice_names)::ITEM_CHOICE_GROUP
			) AS choices_info
		FROM 
			MenuItemsChoiceGroups AS cg
		LEFT JOIN (
			SELECT 
				pg.group_id,
				array_agg(pc.name ORDER BY pg.item_order)::TEXT[] AS choice_names
			FROM 
				PreparationChoicesGroups AS pg
			LEFT JOIN 
				PreparationChoices AS pc ON pg.choice_id = pc.id
			GROUP BY 
				pg.group_id
		) AS choices_subquery ON cg.id = choices_subquery.group_id
		WHERE 
			cg.menu_item_id = mi.id
    )) AS choices,
	(
		SELECT array_agg(i.name ORDER BY mi_ing.item_order)
		FROM MenuItemsIngredientsChanges AS mi_ing
		LEFT JOIN IngredientChanges AS i ON mi_ing.change_id = i.id
		WHERE mi.id = mi_ing.menu_item_id
	) As custom_changes
FROM 
    MenuItems AS mi
LEFT JOIN 
    MenuItemsCategories AS mic ON mi.id = mic.menu_item_id 
LEFT JOIN 
    Categories AS c ON c.id = mic.category_id
WHERE 
    mi.activity_id = p_activity_id
GROUP BY 
    mi.id, 
    mi.name, 
    mi.foreign_name, 
    mi.price, 
    mi.description, 
    mi.foreign_description;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_menu_item(p_activity_id INT, p_item_id INT)
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
    RETURN QUERY
    SELECT 
    mi.id, 
    mi.name, 
    mi.foreign_name, 
    mi.price, 
    mi.description, 
    mi.foreign_description,
	mi.ready_to_serve,
    to_json(array_agg(DISTINCT ROW(c.id, mic.item_order)::ITEM_CATEGORY_ORDER)) AS categories,
	(
		SELECT array_agg(i.name ORDER BY mi_ing.item_order)
		FROM MenuItemsAllergens AS mi_ing
		LEFT JOIN Allergens AS i ON mi_ing.allergen_id = i.id
		WHERE mi.id = mi_ing.menu_item_id
	) As allergens,    
	(
		SELECT array_agg(i.name ORDER BY mi_ing.item_order)
		FROM MenuItemsIngredients AS mi_ing
		LEFT JOIN Ingredients AS i ON mi_ing.ingredient_id = i.id
		WHERE mi.id = mi_ing.menu_item_id
	) As ingredients,
    to_json((
        SELECT 
			array_agg(
				ROW(cg.name, choice_names)::ITEM_CHOICE_GROUP
			) AS choices_info
		FROM 
			MenuItemsChoiceGroups AS cg
		LEFT JOIN (
			SELECT 
				pg.group_id,
				array_agg(pc.name ORDER BY pg.item_order)::TEXT[] AS choice_names
			FROM 
				PreparationChoicesGroups AS pg
			LEFT JOIN 
				PreparationChoices AS pc ON pg.choice_id = pc.id
			GROUP BY 
				pg.group_id
		) AS choices_subquery ON cg.id = choices_subquery.group_id
		WHERE 
			cg.menu_item_id = mi.id
    )) AS choices,
	(
		SELECT array_agg(i.name ORDER BY mi_ing.item_order)
		FROM MenuItemsIngredientsChanges AS mi_ing
		LEFT JOIN IngredientChanges AS i ON mi_ing.change_id = i.id
		WHERE mi.id = mi_ing.menu_item_id
	) As custom_changes
FROM 
    MenuItems AS mi
LEFT JOIN 
    MenuItemsCategories AS mic ON mi.id = mic.menu_item_id 
LEFT JOIN 
    Categories AS c ON c.id = mic.category_id
WHERE 
    mi.activity_id = p_activity_id AND mi.id = p_item_id
GROUP BY 
    mi.id, 
    mi.name, 
    mi.foreign_name, 
    mi.price, 
    mi.description, 
    mi.foreign_description;
END;
$$ LANGUAGE plpgsql;
-- replaces the item allergens with the new ones
CREATE OR REPLACE PROCEDURE replace_menu_item_allergens(p_item_id INT, p_item_allergens TEXT[])
LANGUAGE plpgsql
AS $$
DECLARE
    allergen_id INT;
	allergen_name TEXT;
    item_order INT;
BEGIN
    -- delete all allergens
    DELETE FROM MenuItemsAllergens WHERE menu_item_id = p_item_id;
    item_order:= 0;
    -- add allergens
    FOREACH allergen_name IN ARRAY p_item_allergens
    LOOP
        -- increase order
        item_order := item_order +1;
        RAISE NOTICE 'Processing allergen_name: %', allergen_name;
        IF allergen_name = '' OR TRIM(allergen_name) = '' THEN
            RAISE NOTICE 'is empty: %', allergen_name;
            -- Skip to the next iteration
            CONTINUE;
        END IF;
        -- Convert the allergen string to lowercase
        -- allergen_name := lower(allergen_name);
        SELECT * INTO allergen_name FROM clean_string(allergen_name);
        -- Insert the allergen into the Allergens table or retrieve its ID if it already exists
        BEGIN
            INSERT INTO Allergens(name)
            VALUES (allergen_name)
            RETURNING Allergens.id INTO allergen_id;
        EXCEPTION
            WHEN unique_violation THEN
                SELECT Allergens.id INTO allergen_id
                FROM Allergens
                WHERE Allergens.name = allergen_name;
        END;

        BEGIN
            -- Insert the menu item-allergen relationship into the MenuItemsAllergens table
            INSERT INTO MenuItemsAllergens(menu_item_id, allergen_id,item_order)
            VALUES (p_item_id, allergen_id,item_order);
        -- skip duplicates
        EXCEPTION
            WHEN unique_violation THEN NULL;
        END;
    END LOOP;
END;
$$;

-- replaces the item ingredients with the new ones
CREATE OR REPLACE PROCEDURE replace_menu_item_ingredients(p_item_id INT, p_item_ingredients TEXT[])
LANGUAGE plpgsql
AS $$
DECLARE
    ingredient_id INT;
	ingredient_name TEXT;
    item_order INT;
BEGIN
    -- delete all ingredients
    DELETE FROM MenuItemsIngredients WHERE menu_item_id = p_item_id;
    item_order:= 0;
    -- add ingredients
    FOREACH ingredient_name IN ARRAY p_item_ingredients
    LOOP
        -- increase order
        item_order := item_order +1;
        IF ingredient_name = '' OR TRIM(ingredient_name) = '' THEN
            RAISE NOTICE 'is empty: %', ingredient_name;
            -- Skip to the next iteration
            CONTINUE;
        END IF;
        -- clean the string
        SELECT * INTO ingredient_name FROM clean_string(ingredient_name);
        -- Insert the ingredient into the Ingredients table or retrieve its ID if it already exists
        BEGIN
            INSERT INTO Ingredients(name)
            VALUES (ingredient_name)
            RETURNING Ingredients.id INTO ingredient_id;
        EXCEPTION
            WHEN unique_violation THEN
                SELECT Ingredients.id INTO ingredient_id
                FROM Ingredients
                WHERE Ingredients.name = ingredient_name;
        END;

        BEGIN
            -- Insert the menu item-allergen relationship into the MenuItemsAllergens table
            INSERT INTO MenuItemsIngredients(menu_item_id, ingredient_id,item_order)
            VALUES (p_item_id, ingredient_id,item_order);
        -- skip duplicates
        EXCEPTION
            WHEN unique_violation THEN NULL;
        END;
    END LOOP;
END;
$$;

-- replaces the item choices with the new ones
CREATE OR REPLACE PROCEDURE replace_menu_item_choices(p_item_id INT, p_item_choices ITEM_CHOICE_GROUP[])
LANGUAGE plpgsql
AS $$
DECLARE
	group_name TEXT;
    group_id INT;
    group_choices TEXT[];
    choice_name TEXT;
    choice_id INT;
    choice_order INT;
BEGIN
    -- delete all item choices
    DELETE FROM MenuItemsChoiceGroups WHERE menu_item_id = p_item_id;
    -- add choice
    FOREACH group_name, group_choices IN ARRAY p_item_choices
    LOOP
      
        IF group_name = '' OR TRIM(group_name) = '' THEN
            RAISE NOTICE 'is empty: %', group_name;
            -- Skip to the next iteration
            CONTINUE;
        END IF;
        -- clean the string
        SELECT * INTO group_name FROM clean_string(group_name);
        -- create group
        BEGIN
            INSERT INTO MenuItemsChoiceGroups(name, menu_item_id)
            VALUES (group_name, p_item_id)
            RETURNING MenuItemsChoiceGroups.id INTO group_id;
        EXCEPTION
            WHEN unique_violation THEN
                SELECT MenuItemsChoiceGroups.id INTO group_id
                FROM MenuItemsChoiceGroups
                WHERE MenuItemsChoiceGroups.name = group_name;
        END;
        choice_order := 0;
        -- loop the choices
        FOREACH choice_name IN ARRAY group_choices
        LOOP
            -- increase order
            choice_order := choice_order + 1;
            -- insert or get the choice
            BEGIN
                INSERT INTO PreparationChoices(name)
                VALUES (choice_name)
                RETURNING PreparationChoices.id INTO choice_id;
            EXCEPTION
                WHEN unique_violation THEN
                    SELECT PreparationChoices.id INTO choice_id
                    FROM PreparationChoices
                    WHERE PreparationChoices.name = choice_name;
            END;
            -- insert the choice ignoring duplicates
            BEGIN
                -- Insert the menu item-allergen relationship into the MenuItemsAllergens table
                INSERT INTO PreparationChoicesGroups(group_id, item_order, choice_id)
                VALUES (group_id, choice_order, choice_id);
            -- skip duplicates
            EXCEPTION
                WHEN unique_violation THEN NULL;
            END;
        END LOOP;
    END LOOP;
END;
$$;

-- replaces the item ingredients with the new ones
CREATE OR REPLACE PROCEDURE replace_menu_item_ingredients_changes(p_item_id INT, p_item_changes TEXT[])
LANGUAGE plpgsql
AS $$
DECLARE
    ingr_change_id INT;
	ingr_change_name TEXT;
    item_order INT;
BEGIN
    -- delete all IngredientChanges
    DELETE FROM MenuItemsIngredientsChanges WHERE menu_item_id = p_item_id;
    item_order:= 0;
    -- add ingredients
    FOREACH ingr_change_name IN ARRAY p_item_changes
    LOOP
        -- increase order
        item_order := item_order +1;
        IF ingr_change_name = '' OR TRIM(ingr_change_name) = '' THEN
            RAISE NOTICE 'is empty: %', ingr_change_name;
            -- Skip to the next iteration
            CONTINUE;
        END IF;
        -- clean the string
        SELECT * INTO ingr_change_name FROM clean_string(ingr_change_name);
        -- Insert the ingredient change into the IngredientChanges table or retrieve its ID if it already exists
        BEGIN
            INSERT INTO IngredientChanges(name)
            VALUES (ingr_change_name)
            RETURNING IngredientChanges.id INTO ingr_change_id;
        EXCEPTION
            WHEN unique_violation THEN
                SELECT IngredientChanges.id INTO ingr_change_id
                FROM IngredientChanges
                WHERE IngredientChanges.name = ingr_change_name;
        END;

        BEGIN
            -- Insert the menu item-allergen relationship into the MenuItemsAllergens table
            INSERT INTO MenuItemsIngredientsChanges(menu_item_id, change_id, item_order)
            VALUES (p_item_id, ingr_change_id,item_order);
        -- skip duplicates
        EXCEPTION
            WHEN unique_violation THEN NULL;
        END;
    END LOOP;
END;
$$;
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
-- Create a new order
CREATE OR REPLACE FUNCTION create_order(p_activity_id INT, p_user_id INT,
p_table_number INT, p_people_number INT, p_items ITEM_ORDER_CREATION[])
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
DECLARE
    order_record UserOrders;
    item ITEM_ORDER_CREATION;
BEGIN
        BEGIN
            -- create new order
            INSERT INTO UserOrders(user_id,activity_id,table_number,people_number)
            VALUES(p_user_id, p_activity_id, p_table_number, p_people_number)
            RETURNING * INTO order_record;
        EXCEPTION
            -- order of this table is already open, get it
            WHEN unique_violation THEN
                SELECT * INTO order_record
                FROM UserOrders
                WHERE UserOrders.activity_id = p_activity_id AND UserOrders.table_number = p_table_number;
        END;
    -- add items
    FOREACH item IN ARRAY p_items
    LOOP
        INSERT INTO OrderItems
        (order_id, item_id,
        preparation_choices,custom_changes,ingredients_removed,
        order_group_id, status, notes)
        values
        (order_record.id, item.item_id,
        item.preparation_choices, item.custom_changes, item.ingredients_removed,
        item.order_group_id, item.status, item.notes);
    END LOOP;

    RETURN QUERY SELECT * FROM get_order(order_record.id);
END;
$$ LANGUAGE plpgsql;

-- update an order
CREATE OR REPLACE FUNCTION update_order(p_order_id INT, p_new_items ITEM_ORDER_CREATION[], p_updated_items ITEM_ORDER_UPDATE[])
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
DECLARE
    order_record UserOrders;
    item ITEM_ORDER_CREATION;
    updated_item ITEM_ORDER_UPDATE;
BEGIN
    -- insert new items
    FOREACH item IN ARRAY p_new_items
    LOOP
        INSERT INTO OrderItems
        (order_id, item_id, 
        preparation_choices,custom_changes,ingredients_removed,
        order_group_id, status, notes)
        values
        (p_order_id, item.item_id,
        item.preparation_choices, item.custom_changes, item.ingredients_removed,
        item.order_group_id, item.status, item.notes);
    END LOOP;
    -- update existing items
    FOREACH updated_item IN ARRAY p_updated_items
    LOOP
        UPDATE OrderItems
        SET
            order_group_id = updated_item.order_group_id, -- always updated
            status = CASE WHEN updated_item.status <> status THEN updated_item.status ELSE status END,
            notes = CASE WHEN updated_item.notes <> notes THEN updated_item.notes ELSE notes END,
            is_canceled = CASE WHEN updated_item.is_canceled <> is_canceled THEN updated_item.is_canceled ELSE is_canceled END,
            updated_at = CASE WHEN
                            updated_item.status <> status OR
                            updated_item.notes <> notes OR
                            updated_item.is_canceled <> is_canceled
                        THEN CURRENT_TIMESTAMP
                        ELSE OrderItems.updated_at
                    END
        WHERE
            updated_item.order_item_id = OrderItems.id;
    END LOOP;

    RETURN QUERY SELECT * FROM get_order(p_order_id);
END;
$$ LANGUAGE plpgsql;

-- update an existing order status.
CREATE OR REPLACE FUNCTION update_item_order_status(p_item_order_id INT, p_status ORDER_STATUS)
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
DECLARE
BEGIN
    Update OrderItems
    SET
        status = CASE WHEN p_status <> status THEN p_status ELSE status END,
        updated_at = CASE WHEN p_status <> status
                            THEN CURRENT_TIMESTAMP
                            ELSE OrderItems.updated_at
                        END
    WHERE
            p_item_order_id = OrderItems.id;
    RETURN QUERY SELECT * FROM get_order_from_item(p_item_order_id);
END;
$$ LANGUAGE plpgsql;


-- deletes the order
CREATE OR REPLACE FUNCTION delete_order(p_activity_id INT, p_order_id INT) 
RETURNS BOOLEAN
AS $$
BEGIN

    DELETE FROM UserOrders WHERE id = p_order_id AND activity_id = p_activity_id;

    IF NOT FOUND THEN
        -- Item not found, return false
        RETURN FALSE;
    END IF;

    -- Item found and deleted, return true
    RETURN TRUE;
    
END;
$$ LANGUAGE PLPGSQL;
-- get a order by id
CREATE OR REPLACE FUNCTION get_order(p_order_id INT)
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        uo.id,
        uo.table_number,
        uo.people_number,
        uo.created_at,
        uo.updated_at,
        uo.user_id,
        uo.activity_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_item_id', oi.id,
                'item_id', oi.item_id,
                'preparation_choices', oi.preparation_choices,
                'custom_changes', oi.custom_changes,
                'ingredients_removed', oi.ingredients_removed,
                'order_group_id', oi.order_group_id,
                'status', oi.status,
                'notes', oi.notes,
                'order_item_created_at', oi.created_at,
                'order_item_updated_at', oi.updated_at,
                'is_canceled', oi.is_canceled,
                'item_name', mi.name,
                'item_price', mi.price            
            )
        ) AS order_items

    FROM
        UserOrders AS uo

    LEFT JOIN
        OrderItems AS oi ON uo.id = oi.order_id

    LEFT JOIN
        MenuItems AS mi ON oi.item_id = mi.id
	WHERE uo.id = p_order_id
    GROUP BY
        uo.id, uo.table_number, uo.people_number, uo.created_at, uo.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_orders(p_user_id INT)
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        uo.id,
        uo.table_number,
        uo.people_number,
        uo.created_at,
        uo.updated_at,
        uo.user_id,
        uo.activity_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_item_id', oi.id,
                'item_id', oi.item_id,
                'preparation_choices', oi.preparation_choices,
                'custom_changes', oi.custom_changes,
                'ingredients_removed', oi.ingredients_removed,
                'order_group_id', oi.order_group_id,
                'status', oi.status,
                'notes', oi.notes,
                'order_item_created_at', oi.created_at,
                'order_item_updated_at', oi.updated_at,
                'is_canceled', oi.is_canceled,
                'item_name', mi.name,
                'item_price', mi.price            
            )
        ) AS order_items

    FROM
        UserOrders AS uo

    LEFT JOIN
        OrderItems AS oi ON uo.id = oi.order_id

    LEFT JOIN
        MenuItems AS mi ON oi.item_id = mi.id
	WHERE uo.user_id = p_user_id
    GROUP BY
        uo.id, uo.table_number, uo.people_number, uo.created_at, uo.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_activity_orders(p_activity_id INT)
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        uo.id,
        uo.table_number,
        uo.people_number,
        uo.created_at,
        uo.updated_at,
        uo.user_id,
        uo.activity_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_item_id', oi.id,
                'item_id', oi.item_id,
                'preparation_choices', oi.preparation_choices,
                'custom_changes', oi.custom_changes,
                'ingredients_removed', oi.ingredients_removed,
                'order_group_id', oi.order_group_id,
                'status', oi.status,
                'notes', oi.notes,
                'order_item_created_at', oi.created_at,
                'order_item_updated_at', oi.updated_at,
                'is_canceled', oi.is_canceled,
                'item_name', mi.name,
                'item_price', mi.price            
            )
        ) AS order_items

    FROM
        UserOrders AS uo

    LEFT JOIN
        OrderItems AS oi ON uo.id = oi.order_id

    LEFT JOIN
        MenuItems AS mi ON oi.item_id = mi.id
	WHERE uo.activity_id = p_activity_id
    GROUP BY
        uo.id, uo.table_number, uo.people_number, uo.created_at, uo.updated_at;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_order_from_item(p_order_item_id INT)
RETURNS TABLE (
    id INT,
    table_number INT,
    people_number INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id INT,
    activity_id INT,
    items JSON
) AS $$
DECLARE
    order_id INT;
BEGIN
    SELECT OrderItems.order_id INTO order_id FROM OrderItems where OrderItems.id = p_order_item_id;

    RETURN QUERY SELECT * FROM get_order(order_id);
END;
$$ LANGUAGE plpgsql;
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

/* 
    password: Password01
    crypted password: $2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO
*/
/* Create admin and activity */
SELECT * from create_admin('pizzeria','$2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO');
SELECT * from update_password('pizzeria','$2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO');
SELECT * from update_activity('pizzeria','Pizzeria Ratatouille','','Via de Rivoli');
/* Create users */
Select * from create_user('pizzeria','manager','$2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO','manager');
Select * from create_user('pizzeria','waiter1','$2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO','waiter');
Select * from create_user('pizzeria','waiter2','$2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO','waiter');
Select * from create_user('pizzeria','chef1','$2a$10$RlMvHS38Zp/tpdIWr2XDVOusDSNq4jJV2pqA3JVYnQvZBsFEGsBlO','chef');
/* Create categories */
Select * from create_category('pizzeria','Antipasti');
Select * from create_category('pizzeria','Pizze');
Select * from create_category('pizzeria','Desserts');
Select * from create_category('pizzeria','Drinks');
/* Create items */
Select * from create_menu_item('pizzeria','Antipasti','Bruschette',3,'Pane e pomodoro', '{}', '', '', false,'{pomodoro,pane,basilico}',
							   Array[('quantita','{"2","3","4"}')]::ITEM_CHOICE_GROUP[],'{mozzarella}' );
Select * from create_menu_item('pizzeria','Antipasti','Zeppoline di alghe',3,'Frittelle di alghe', '{}', '', '', false,'{alga, farina}',
							   '{}','{}' );
/* Pizze */
Select * from create_menu_item('pizzeria','Pizze','Margherita',4.5,'pomodoro e mozzarella', '{latticini}', '', '', false,'{pomodoro, farina, basilico,mozzarella}',
							  '{}','{provola}' );
Select * from create_menu_item('pizzeria','Pizze','Marinara',4,'pomodoro e origano', '{}', '', '', false,'{pomodoro, farina, basilico, origano}',
							  '{}','{}' );
Select * from create_menu_item('pizzeria','Pizze','Diavola',6,'pomodoro e mozzarella e salame piccante', '{latticini}', '', '', false,'{pomodoro, farina, basilico, mozzarella, "salame piccante"}',
							  '{}','{}' );
Select * from create_menu_item('pizzeria','Pizze','Quattro formaggi',7,'mozzarella e formaggio', '{latticini}', '', '', false,'{farina, basilico, mozzarella, formaggio}',
							  '{}','{}' );
/* Desserts */
Select * from create_menu_item('pizzeria','Desserts','Gelato al cioccolato',4,'cioccolato', '{latticini}', '', '', false,'{cioccolato, latte}',
							  Array[('quantita','{"2","3","4"}'),('tipo','{"cono","coppetta media","coppetta grande"}')]::ITEM_CHOICE_GROUP[],'{}' );
Select * from create_menu_item('pizzeria','Desserts','Gelato alla vanigia',4,'vaniglia', '{latticini}', '', '', false,'{vaniglia, latte}',
							  Array[('quantita','{"2","3","4"}'),('tipo','{"cono","coppetta media","coppetta grande"}')]::ITEM_CHOICE_GROUP[],'{}' );

/* Drinks */
Select * from create_menu_item('pizzeria','Drinks','Coca cola',2,'', '{}', '', '', true,'{}','{}','{}' );
Select * from create_menu_item('pizzeria','Drinks','Acqua frizzante',2,'', '{}', '', '', true,'{}','{}','{}' );
Select * from create_menu_item('pizzeria','Drinks','Acqua naturale',2,'', '{}', '', '', true,'{}','{}','{}' );
Select * from create_menu_item('pizzeria','Drinks','Birra peroni',2.5,'', '{}', '', '', true,'{}','{}','{}' );
