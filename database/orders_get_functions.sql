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