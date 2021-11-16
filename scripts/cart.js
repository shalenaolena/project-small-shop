class Cart extends Items {
    constructor() {
        super ();
        this.arrCart = [];
    }

    buttonClick () {
        rootCatalogPlace.addEventListener("click", (event) => {


            if (event.target && event.target.matches("img.cart_img")) {

                let currentItem = this.currentItemAfterEvent ("data-btn-cart", event);

                console.log(currentItem);
                this.arrCart.push(currentItem);
                console.log(this.arrCart);
                
            }
        });
    }

}

const cart = new Cart ();
cart.buttonClick ();