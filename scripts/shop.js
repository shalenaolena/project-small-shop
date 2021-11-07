
//Магазин
class Shop {
    constructor(shopName, arrItems, arrItemsObj){
        this.shopName = shopName;
        this.arrItems = arrItems;
        this.arrItemsObj = arrItemsObj;
    }

    shopTitle () {
        document.getElementById("logo_text").innerHTML = this.shopName;     //Назва магазину
    }

    openModalWindowByButton (btn, modalWin) {                              //відкриття модальних вікон - (кнопка, вікно)
        btn.on ('click', function (){
            $("#modal_overlay_id").fadeIn();
            modalWin.fadeIn();
        });
    }
    closeModalWindows () {
        $(".modal_close").on("click", function () {         //закриття модальних вікон хрестиком
            $('.modal_win').fadeOut();                      //#modal_overlay_id, #modal_item_add_edit, #modal_filter_id
            
        });
    }

                                                            //отримання актуального массиву данних з localStorage
    getDataFromLocalStorage (key) {
        let raw = localStorage.getItem(key);
        let newArrFromLocalStorage = JSON.parse(raw);
        this.arrItems = newArrFromLocalStorage;
    }

    setDataToLocalStorage (key, itemToAdd) {                //записати дані у localStorage
        localStorage.setItem(key, JSON.stringify(itemToAdd));
            alert(`Додадно новий елемент у ${key}`);
            let raw = localStorage.getItem(key);
            let result = JSON.parse(raw);
            console.log(result);
            return result;

    }


    formData() {
        this.getDataFromLocalStorage ("arrItems"); 
        alert(`Hello! We get ${this.arrItems.length} items in Local Storage! xoxo`); //повідомлення - актуальна кількіть товарів

        $("#modal_item_add_edit_btn").on("click", () => {       

            let e = document.getElementById("modal_item_select_category");

            let itemCategoryData = e.options[e.selectedIndex].value; 
            let itemNameData = document.querySelector("#modal_form_item_name").value;
            let itemPriceData = document.querySelector("#modal_form_item_price").value;
            let itemImgUrlData = document.querySelector("#modal_form_item_img_url").value;
            let itemDescriptionData = document.querySelector("#modal_form_textarea_item_description").value;
            let itemIdData = `item${this.arrItems.length}`;
            
            let result = new Items (itemIdData, itemNameData, itemCategoryData, itemPriceData, itemImgUrlData, itemDescriptionData);
            this.arrItems.push(result);
            this.setDataToLocalStorage ("arrItems", this.arrItems);
        }) 
    }

    parseArrToClassItems (arr) {
        for (let i = 0; i < arr.length; i++) {
            let newItem = new Items (arr[i]["itemId"], 
            arr[i].itemName, 
            arr[i].itemCategory, 
            arr[i].itemPrice, 
            arr[i].itemImg, 
            arr[i].itemDescription);
            this.arrItemsObj.push(newItem);
        }
    }

  
   
}


//Класс товаров
class Items extends Shop {
    constructor (itemId, itemName, itemCategory, itemPrice, itemImg, itemDescription) {
        super ();
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemCategory = itemCategory;
        this.itemPrice = itemPrice;
        this.itemImg = itemImg;
        this.itemDescription = itemDescription;
    }

    loadCatalog (arr) {

        for (let i = 0; i < arr.length; i++) {
            document.querySelector("#container_items_catalog").insertAdjacentHTML("afterbegin",

                `<div class="item" id="${i}">
            <div class="btn_item_edit">
                <img src="icons/edit.png" alt="">
            </div>
            <img src="${arr[i].itemImg}" alt="">
            <div class="item_data_blok">
                <div class="item_name">
                    <h3>${arr[i].itemName}</h3>
                    <h4 class = "item_price">Ціна: ${arr[i].itemPrice} грн</h4>
                </div>
                <div class="item_btns">
                    <div class="item_btn_more_info">
                        Деталі
                    </div>
                    <div class="item_btn_add_to_cart">
                            <img src="icons/white-cart.png" alt="">
                    </div>
                </div>
            </div>
        </div> <!--item -->`

            );

            
        }
        
        
    }
    
}


const shop = new Shop("Shop", [], []);                                                 //Створення магазину
shop.shopTitle();                                                                  //Назва магазину
shop.getDataFromLocalStorage ("arrItems");                                         //Актуальний массив данних з Local Storage                              
shop.openModalWindowByButton( $("#btn_add_item"), $("#modal_item_add_edit") );     //Відкриття для редагування
shop.openModalWindowByButton( $("#btn_filter"), $("#modal_filter_id") );

shop.closeModalWindows();   

shop.formData();
console.log(shop.arrItems);
shop.parseArrToClassItems (shop.arrItems);
console.log(shop.arrItemsObj);
let items = new Items();
items.loadCatalog (shop.arrItemsObj);

//After Catalog Upload
shop.openModalWindowByButton( $(".btn_item_edit"), $("#modal_item_add_edit") );            //Edit Button                                   

