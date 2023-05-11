async function getProducts() {
    try {
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/'
        );
        const res = await data.json();

        window.localStorage.setItem("products", JSON.stringify(res));

        return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {

    const productsHTML = document.querySelector(".products");

    let html = "";

    for (const product of db.products) {
        const buttonAdd = product.quantity ? `<i class='bx bx-plus' id= '${product.id}' ></i>` : "<span class= 'soldOut'>sold out</span>"

        html += `
        <div class= "product">
            <div class= "product__img">
                <img src="${product.image}" alt= "imagen" />
            </div>
            
            <div class= "product__info">
                <h4>${product.name} | <span><b>Stock</b>: ${product.quantity} </span></h4>
                <h5>
                    ${product.price} 
                    ${buttonAdd}
                    
                </h5>
            </div>
        </div>
        `;
    }

    productsHTML.innerHTML = html;
}

function handleShowCart(db) {
    const iconCartHTML = document.querySelector(".bx-shopping-bag");
    const iconCloseCartHTML = document.querySelector("#iconCloseCart");
    const cartHTML = document.querySelector(".cart");
    
    let isCartOpen = localStorage.getItem('isCartOpen') === 'true';
    
    if (isCartOpen) {
        cartHTML.style.display = 'block';
    } else {
        cartHTML.style.display = 'none';
    }
    
    iconCartHTML.addEventListener("click", function() {
        if (isCartOpen) {
        cartHTML.style.display = 'none';
        isCartOpen = false;
        localStorage.setItem('isCartOpen', 'false');
        } else {
        cartHTML.style.display = 'block';
        isCartOpen = true;
        localStorage.setItem('isCartOpen', 'true');
        }
    });
    
    iconCloseCartHTML.addEventListener("click", function() {
        cartHTML.style.display = 'none';
        isCartOpen = false;
        localStorage.setItem('isCartOpen', 'false');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleShowCart();
});

function addToCartFromProducts (db) {

    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function(e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(product => product.id === id);

            if(db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount) {
                    return alert ("No tenemos mas en bodega");
                }
                db.cart[productFind.id].amount++;
            } else {
                db.cart[productFind.id] = {...productFind, amount:1}
                
            }

            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProductsinCart(db);
            printTotal (db);
            handlePrintAmountProducts (db)


            console.log(db.cart);
        }

    });

}

function printProductsinCart(db) {
    const cartProducts = document.querySelector(".cart_products");
    
    let html = ''
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount} = db.cart[product]
        html += `
        <div class= "cart_product">
            <div class= "cart_product--img">
                <img src= "${image}" alt = "imagen" />
            </div>
            <div class= "cart_product--body">
                <h4>${name} | $${price} </h4>
                <p>Stock: ${quantity} </p>

                <div class= "cart_product--body-op" id= "${id}">
                    <i class='bx bx-minus'></i>
                    <span>${amount} unit </span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash'></i>
                </div>
            </div>    
        </div>
        `;
}

cartProducts.innerHTML = html

}

function handleProductsInCart(db) {
    const cart_products = document.querySelector(".cart_products");
    cart_products.addEventListener("click", function(e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.parentElement.id);
            
            const productFind = db.products.find(product => product.id === id);
            if (productFind.quantity === db.cart[productFind.id].amount) {
                return alert ("No tenemos mas en bodega")};

            db.cart[id].amount++;

        }
        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id);
             if (db.cart[id].amount === 1) {
                const response = confirm ("Estas seguro de que quieres eliminar este producto?");

                if (!response) return;
                delete db.cart[id];
             } else {
                db.cart[id].amount--;
             }
            

        }
        if (e.target.classList.contains("bx-trash")) {
            const id = Number(e.target.parentElement.id);

            const response = confirm ("Estas seguro de que quieres eliminar este producto?");

                if (!response) return;

            delete db.cart[id];

        }
        
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printProductsinCart(db)
        printTotal (db);
        handlePrintAmountProducts (db)
    });
}

function printTotal (db) {
    const infoTotal= document.querySelector(".info_total");
    const infoAmount = document.querySelector(".info_amount");

    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }

    infoAmount.textContent = amountProducts + " items ";
    infoTotal.textContent = "$" + totalProducts + ".00 ";
}

function handleTotal (db) {
    const btnBuy= document.querySelector(".btn_buy");

    btnBuy.addEventListener("click", function () {
        if (!Object.values(db.cart).length) return alert ("Vas a comprar aire?");
        const response = confirm("Seguro que quieres comprar?");

        if (!response) return;
        
        const currentProducts = []

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push ({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });

            } else {
                currentProducts.push(product);
            }
        }

        db.products = currentProducts;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        
        printTotal (db);
        printProductsinCart(db);
        printProducts(db);
        handlePrintAmountProducts (db)

    });

}

function handlePrintAmountProducts (db) {
    const amountProducts= document.querySelector(".amountProducts");

    let amount = 0

    for (const product in db.cart) {
        amount += db.cart[product].amount;
        
    }
    amountProducts.textContent = amount;
}

function darkMode (db) {
    const mooniconHTML = document.querySelector(".moon-icon");
    const bodyHTML = document.querySelector("body");
    const bandaHTML = document.querySelector(".banda");
    const navLogoIconHTML = document.querySelector(".nav_logo-icon");
    const loadHTML = document.querySelector(".load");
    

    mooniconHTML.addEventListener("click", function () {
    bodyHTML.classList.toggle("dark_mode");
    bandaHTML.classList.toggle("dark_mode");
    navLogoIconHTML.classList.toggle("dark_mode");
    document.documentElement.classList.toggle('dark-mode');
    loadHTML.classList.toggle("dark_mode");


    
});
}

function animationScroll () {
    const headerPrincipalHTML= document.querySelector(".headerPrincipal");
    let y = window.scrollY;

    if (y > 100) {
        headerPrincipalHTML.classList.add("headerPrincipal--scroll");
    } else {
        headerPrincipalHTML.classList.remove("headerPrincipal--scroll");
    }


}

window.onscroll = () => animationScroll()


function showloading() {
    const miLoad = document.querySelector('.load');
    const miLoadGif = document.querySelector('.load__gif');
    const hidden = document.querySelector('.hidden__load');

    window.addEventListener('load', function() {
    setTimeout(function() {
        miLoad.classList.add('loadoculto');
        miLoadGif.classList.add('loadoculto');
        hidden.classList.add('loadoculto');
        
    }, 2000);
    });
}
showloading()

window.addEventListener('load', function() {
    document.querySelector('.load').classList.add('oculto');
});


async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };
    
    printProducts(db);
    handleShowCart(db);
    addToCartFromProducts (db);
    printProductsinCart(db);
    handleProductsInCart(db);
    printTotal (db);
    handleTotal (db);
    handlePrintAmountProducts (db)
    darkMode (db)
    
    

    const amountProducts= document.querySelector(".amountProducts");

    let amount = 0

    for (const product in db.cart) {
        amount += db.cart[product].amount;
        
    }
    amountProducts.textContent = amount;

}

main();