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
