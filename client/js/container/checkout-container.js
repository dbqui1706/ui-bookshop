import { CartService } from "../service/cart-service.js";
import { OrderService } from "../service/order-service.js";

export class CheckoutContainer {
    constructor() {
        this.cartOrder = JSON.parse(localStorage.getItem('cartOrder'));
        this.cartService = new CartService();
        this.orderService = new OrderService();
    }

    async init() {
       
    }
    
}
