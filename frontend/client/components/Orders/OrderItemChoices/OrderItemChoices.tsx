import React from "react";
import { customChangesColor, ingredientsRemovedColor, preparationChoicesColor } from '../../../helper/themeManager';
import Chip from '@mui/material/Chip';

interface ItemChoicesFields {
    preparationChoices: string[];
    customChanges: string[];
    ingredientsRemoved: string[];
}

interface OrderItemChoicesProps {
    item: ItemChoicesFields;
}

const OrderItemChoices: React.FC<OrderItemChoicesProps> = ({ item }) => {
    return (
        <>
            {/* Show choices */}
            {
                item.preparationChoices.map((s, index) => (
                    <Chip variant={'outlined'} label={s} key={index} sx={{ borderColor: preparationChoicesColor }} />
                ))
            }
            {/* Show Changes */}
            {
                item.customChanges.map((s, index) => (
                    <Chip variant={'outlined'} label={s} key={index} sx={{ borderColor: customChangesColor }} />
                ))
            }
            {/* Show Ingredients Removed */}
            {
                item.ingredientsRemoved.map((s, index) => (
                    <Chip variant={'outlined'} label={s} key={index} sx={{ borderColor: ingredientsRemovedColor }} />
                ))
            }
        </>
    )
}

export default OrderItemChoices;