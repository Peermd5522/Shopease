import Cart from "../components/Cart";
import { Link } from "react-router-dom";
import "./CartPage.css";

function CartPage(props){
    return(

    <Cart
      cart={props.cart}
      total={props.total}
      deleteItem={props.deleteItem}
      increaseQuantity={props.increaseQuantity}
      decreaseQuantity={props.decreaseQuantity}
    />
    );
}

export default CartPage;