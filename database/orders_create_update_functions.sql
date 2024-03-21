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