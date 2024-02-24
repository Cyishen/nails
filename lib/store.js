import { create } from "zustand";
import { persist } from "zustand/middleware"
import toast from "react-hot-toast";

const INITIAL_STATE = {
    products: [],
    totalItems: 0,
    totalPrice: 0,
};

export const useCartStore = create(persist( (set, get) => ({
    products: INITIAL_STATE.products,
    totalItems: INITIAL_STATE.totalItems,
    totalPrice: INITIAL_STATE.totalPrice,

    addToCartStore(item) {
        //取得購物車所有商品
        const products = get().products
        // console.log("新增",products)
        //尋找find.購物車中id是否與新添加商品item.id相同 && title是否相同
        const productInCart = products.find( product => product.id === item.id )

        //商品存在:更新數量與價格
        if( productInCart ){
            const updateProducts = products.map( (product) => product.id === productInCart.id ? {
                ...item,
                quantity: item.quantity + product.quantity,
                // price: item.price + product.price,

                // originalQuantity: item.quantity,
                // originalPrice: item.price, 
            } : product)
    
            set( (state)=> ({
                products: updateProducts,
                totalItems: state.totalItems + item.quantity,
                totalPrice: state.totalPrice + item.price * item.quantity,
            }))
        } else {
            //商品不存在: 添加...item商品所有屬性到...products中
            const updateProducts = [...products, {
                ...item,

                // originalQuantity: item.quantity,
                // originalPrice: item.price, 
            }]
    
            set( (state) => ({
                products: updateProducts,
                totalItems: state.totalItems + item.quantity,
                totalPrice: state.totalPrice + item.price,
            }));
        }
    },

    increaseQty(cartItem) {
        const updatedProducts = get().products.map((product) => product.id === cartItem.id ? {
            ...product, 
            quantity: product.quantity + 1, 
            // price: product.price + cartItem.price
            } : product);

        set({
            products: updatedProducts,
            totalItems: get().totalItems + 1,
            totalPrice: get().totalPrice + cartItem.price,
        });
    },

    decreaseQty(cartItem) {
        if (cartItem.quantity === 1) { 
            return; 
        }

        const updatedProducts = get().products.map((product) => product.id === cartItem.id ? { 
            ...product, 
            quantity: product.quantity - 1, 
            // price: product.price - cartItem.price 
            } : product);

        set({
            products: updatedProducts,
            totalItems: get().totalItems - 1,
            totalPrice: get().totalPrice - cartItem.price,
        });
    },

    removeFromCartStore(item) {
        if (window.confirm('移除此商品 🛍️？')) {
            set((state) => ({
                products: state.products.filter((product) => product.id !== item.id),
                totalItems: state.totalItems - item.quantity,
                totalPrice: state.totalItems - item.quantity === 0 ? 0 : state.totalPrice - item.price,
            }));
            toast('移除商品成功!', {
                icon: '🛍️',
            });
        }
    }
    
}), {name: "cart", skipHydration: true} ))