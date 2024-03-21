import { createTheme } from '@mui/material/styles';
import { OrderStatus } from '../../shared/data';

export const primaryColor = '#37474f';
export const secondaryColor = '#263238';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: secondaryColor,
        },
    },
});


export function getOrderStatusColor(status: OrderStatus): string {
    switch (status) {
        case OrderStatus.ToPrepare:
            return '#F9564F';
        case OrderStatus.Preparing:
            return '#F3C677';
        case OrderStatus.ToServe:
            return '#B33F62';
        case OrderStatus.Served:
            return servedStatusColor;
        case OrderStatus.Waiting:
            return '#263238';
    }
}
export const servedStatusColor = '#BFCBC2';

export const preparationChoicesColor = '#08725D';
export const customChangesColor = '#B89000';
export const ingredientsRemovedColor = '#DA0711';
