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