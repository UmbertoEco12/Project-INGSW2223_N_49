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
