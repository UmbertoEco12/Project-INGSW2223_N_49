import express from 'express'
import {
    getIcon, jsonProxy, proxy
} from '../controllers/apiController.js'

const router = express.Router();

router.post('/auth/login', jsonProxy);

router.put('/user/password', jsonProxy);
router.put('/user/username', jsonProxy);
router.put('/admins/activity', jsonProxy);
router.get('/user', jsonProxy);
router.get('/admins/activity', jsonProxy);
router.get('/icon/:filePath', getIcon);
router.post('/admins/upload', proxy);
router.get('/admins/staff', jsonProxy);
router.post('/admins/staff', jsonProxy);
router.delete('/admins/staff/:id', jsonProxy);

router.post('/menu/categories', jsonProxy);
router.get('/menu/categories', jsonProxy);
router.delete('/menu/categories/:id', jsonProxy);
router.put('/menu/categories/order', jsonProxy);
router.put('/menu/categories', jsonProxy);

router.get('/menu/items', jsonProxy);
router.post('/menu/items', jsonProxy);
router.delete('/menu/items/:id', jsonProxy);
router.put('/menu/items/order/:categoryId', jsonProxy);
router.put('/menu/items', jsonProxy);
router.post('/menu/categories/:categoryId/items/:itemId', jsonProxy);
router.delete('/menu/categories/:categoryId/items/:itemId', jsonProxy);

router.get('/orders', jsonProxy);
router.post('/orders', jsonProxy);
router.put('/orders/:orderId', jsonProxy);
router.put('/orders/:orderItemId/:status', jsonProxy);
router.delete('/orders/:orderId', jsonProxy);

router.post('/admins', jsonProxy);
export default router;