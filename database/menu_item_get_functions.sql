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