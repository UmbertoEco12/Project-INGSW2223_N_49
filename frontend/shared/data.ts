import { ItemChoiceGroup } from "./userRequests";

export interface OrderItem {
    orderItemId: number;
    itemId: number;
    preparationChoices: string[];
    customChanges: string[];
    ingredientsRemoved: string[];
    orderGroupId: number;
    status: string;
    notes: string;
    orderItemCreatedAt: string;
    orderItemUpdatedAt: string;
    isCanceled: boolean;
    itemName: string;
    itemPrice: number;
}

export interface Order {
    id: number;
    tableNumber: number;
    peopleNumber: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface Category {
    id: number;
    name: string;
    order: number;
}

export interface ItemCategoryOrder {
    categoryId: number;
    itemOrder: number;
}

export interface MenuItem {
    id: number;
    name: string;
    foreignName: string;
    price: number;
    description: string;
    foreignDescription: string;
    categories: ItemCategoryOrder[];
    allergens: string[];
    ingredients: string[];
    customChanges: string[];
    choices: ItemChoiceGroup[];
    readyToServe: boolean;
}
export enum OrderStatus {
    ToPrepare = 'to_prepare',
    ToServe = 'to_serve',
    Served = 'served',
    Waiting = 'waiting',
    Preparing = 'preparing'
}

export interface Activity {
    id: number;
    activityName: string;
    phoneNumber: string;
    address: string;
    icon: string;
}

export interface Staff {
    id: number;
    username: string;
    role: string;
}

export enum UserRole {
    Manager = 'manager',
    Chef = 'chef',
    Waiter = 'waiter',
}