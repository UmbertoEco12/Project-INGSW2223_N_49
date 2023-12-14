export interface LoginRequest {
    username: string;
    password: string;
}

export interface UpdatePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateUsernameRequest {
    oldUsername: string;
    newUsername: string;
    password: string;
}

export interface UpdateActivityRequest {
    activityName: string,
    phoneNumber: string;
    address: string;
}

export interface CreateStaffRequest {
    username: string;
    password: string;
    role: string;
}

export interface AddCategoryRequest {
    name: string;
}

export interface CategoryOrder {
    id: number;
    menuOrder: number;
}
export interface UpdateCategoryOrderRequest {
    categories: CategoryOrder[];
}

export interface UpdateCategoryNameRequest {
    id: number;
    newName: string;
}

export interface ItemChoiceGroup {
    groupName: string;
    choices: string[]
}

export interface CreateMenuItemRequest {
    name: string;
    foreignName: string;
    price: number;
    description: string;
    foreignDescription: string;
    categories: number[];
    allergens: string[];
    ingredients: string[];
    customChanges: string[];
    choices: ItemChoiceGroup[];
    readyToServe: boolean;
}

export interface UpdateMenuItemRequest {
    id: number;
    newName: string;
    newForeignName: string;
    newPrice: number;
    newDescription: string;
    newForeignDescription: string;
    newAllergens: string[];
    newIngredients: string[];
    newCustomChanges: string[];
    newChoices: ItemChoiceGroup[];
    newReadyToServe: boolean;
}

export interface ItemUpdateCategoryOrder {
    itemId: number;
    itemOrder: number;
}
export interface UpdateMenuItemCategoryOrderRequest {
    orders: ItemUpdateCategoryOrder[];
}

export interface OrderItemCreation {
    itemId: number;
    preparationChoices: string[];
    customChanges: string[];
    ingredientsRemoved: string[];
    orderGroupId: number;
    status: string;
    notes: string;
}

export interface CreateOrderRequest {
    tableNumber: number;
    peopleNumber: number;
    items: OrderItemCreation[];
}

export interface OrderItemUpdate {
    orderItemId: number;
    orderGroupId: number;
    status: string;
    notes: string;
    isCanceled: boolean;
}

export interface UpdateOrderRequest {
    updates: OrderItemUpdate[];
    creations: OrderItemCreation[];
}

export interface CreateAdminRequest {
    adminUsername: string;
    adminPassword: string;
}