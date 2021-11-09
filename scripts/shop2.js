//Магазин
class Shop {
    constructor(shopName, arrItems, arrItemsObj){
        this.shopName = shopName;
        this.arrItems = arrItems;
        this.arrItemsObj = arrItemsObj;
    }

    showMessage(massege, time) {

        $("#modal_massege_id, .modal_massege_overlay").fadeIn();
        $("#modal_massege_text").text(massege);

        setTimeout( () => {
            $(".modal_massege_overlay, #modal_massege_id").fadeOut();
        }, time);  
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

    openModalWinWithOutEvent(modalWin) {
        $("#modal_overlay_id").fadeIn();
            modalWin.fadeIn();

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
            this.showMessage(`Внесено зміни у ${key}!`, 2000);
            let raw = localStorage.getItem(key);
            let result = JSON.parse(raw);
            console.log(result);
            return result;

    }


    formData() {
        this.getDataFromLocalStorage ("arrItems"); 

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
            this.getDataFromLocalStorage ("arrItems");
            // this.parseArrToClassItems (this.arrItems);

        }) 
    }

    parseArrToClassItems () {
        let newItems;
        //console.log(`!!!${this.arrItems.length}`);
        for (let i = 0; i < this.arrItems.length; i++) {
            newItems = new Items (
            this.arrItems[i]["itemId"], 
            this.arrItems[i].itemName, 
            this.arrItems[i].itemCategory, 
            +this.arrItems[i].itemPrice, 
            this.arrItems[i].itemImg, 
            this.arrItems[i].itemDescription);
            
            this.arrItemsObj.push(newItems);
        }
    }

    updateArrItemsObj() {
        this.getDataFromLocalStorage ("arrItems");                                                                                                      
        this.parseArrToClassItems (this.arrItems); 
    }

    calcSum() {
        let result = 0;
        for (let i = 0; i < this.arrItems.length; i++) {
            result += +this.arrItems[i]["itemPrice"];
        }
        return result;
        
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
        this.arrItems = this.arrItems;
        this.arrItemsObj = this.arrItemsObj;

    }

    loadCatalog (arr) {

        for (let i = 0; i < arr.length; i++) {
            document.querySelector("#container_items_catalog").insertAdjacentHTML("afterbegin",

                `<div class="item" id="${i}">
                    <img src="${arr[i].itemImg}" alt="">
                    <div class="item_data_blok">
                        <div class="item_name">
                            <h3>${arr[i].itemName}</h3>
                            <h4 class = "item_price">Ціна: ${arr[i].itemPrice} грн</h4>
                        </div>
                        <div class="item_btns">
                            <div class="item_btn_more_info" data-btn-open="${arr[i].itemId}" id="open${arr[i].itemId}">
                                Деталі
                            </div>
                            <div class="item_btn_add_to_cart">
                                    <img src="icons/white-cart.png" alt="">
                            </div>
                        </div>
                    </div>
                </div> <!--item -->`

                // <div class="btn_item_edit" id="edit${arr[i].itemId}" data-btn-edit="${arr[i].itemId}">
                    //     <img src="icons/edit.png" alt="">
                    // </div>
        );  
        }  
    }

    currentItemAfterEvent (dataAtr) {
        
        this.getDataFromLocalStorage ("arrItems");
        let buttonData = event.currentTarget.getAttribute(dataAtr);            
        return this.arrItems.find(item => item.itemId == buttonData);
        
    }

    fillingFieldsBySelectors (name, price, descr, currentItem) {
        $(name).html(currentItem.itemName);
        $(price).html(currentItem.itemPrice);
        $(descr).html(currentItem.itemDescription);

    }
    

    showItem () {
          
        $(".item_btn_more_info").on("click", (event) => {
            $("#info_text_place_id").html(` <ul>
            <li class="item_name" id="item_name_info_id"></li>
            <li class="item_category">&#9734; <span id="item_category_info_id"></span></li>
            <li class="item_price" id="item_price_info_id"></li>
            <li class="item_descr" id="item_descr_modal_show"></li>
        </ul> `
            );
            
            this.openModalWinWithOutEvent($("#overlay_info_id"));

            let currentItem = this.currentItemAfterEvent("data-btn-open");
            $("#modal_item_edit_btn").attr('data-btn-open', currentItem.itemId);
            $("#modal_item_delete_btn").attr('data-btn-open', currentItem.itemId);

            this.fillingFieldsBySelectors ( 
            "#item_name_info_id",  
            "#item_price_info_id", 
            "#item_descr_modal_show",
            currentItem);
            $("#item_img_info_id img").attr('src', currentItem.itemImg);
            $("#item_category_info_id").html(currentItem.itemCategory);
            // event.stopPropagation();

            this.editItem ();
            this.deleteItem();
           })    
    }

    editItem () {
        $("#modal_item_edit_btn").on("click", (event) => {
            

            $("#info_text_place_id").html(
                `<select name="category" id="edit_item_select_category">
                <option value="Cats">Котики</option>
                <option value="Dogs">Собачки</option>
                <option value="Birds">Пташечки</option>
                <option value="Other">Інші</option>
              </select>
            <input type="text" name="name" id="edit_item_name" placeholder="Назва">
            <input type="text" name="price" id="edit_item_price" placeholder="Price">
            <input type="text" name="url" id="edit_item_img_url" placeholder="Image URL 500x500" value="img/tit1.jpg">
            <textarea name="description" id="edit_item_description" cols="20" rows="10" placeholder="Опис"></textarea>
            <button id="edit_item_btn">НАДІСЛАТИ</button>`);

            let currentItem = this.currentItemAfterEvent("data-btn-open");
            $("#edit_item_btn").attr('data-btn-open', currentItem.itemId);
            

            console.log(this.arrItems);
            console.log(currentItem);

            $("#edit_item_select_category").val(currentItem.itemCategory);
            $("#edit_item_name").val(currentItem.itemName);
            $("#edit_item_price").val(currentItem.itemPrice);
            $("#edit_item_img_url").val(currentItem.itemImg);
            $("#edit_item_description").val(currentItem.itemDescription);

            $("#edit_item_img_url").on("change", (event) => {
                $("#item_img_info_id img").attr('src', $("#edit_item_img_url").val());
            })
            

            $('#your_id [value=3]').attr('selected', 'true');

            $("#edit_item_btn").on("click", (event) => {
                let itemId = currentItem.itemId;
                let itemName = $("#edit_item_name").val();
                let itemCategory = $("#edit_item_select_category").val();
                let itemPrice = $("#edit_item_price").val();
                let itemImg = $("#edit_item_img_url").val();;
                let itemDescription = $("#edit_item_description").val();

                let newObj = {itemId, itemName, itemCategory, itemPrice, itemImg, itemDescription};
                console.log(newObj);

                this.arrItems = this.arrItems.map(obj => {
                    if (obj.itemId === newObj.itemId) {
                      return newObj;
                    }
                    return obj;
                  });

                  this.setDataToLocalStorage ("arrItems", this.arrItems);
                  //this.updateArrItemsObj(); 
                  console.log(this.arrItemsObj);
                  this.updateArrItemsObj();
                  this.loadCatalog (this.arrItemsObj);
                  shop.closeModalWindows();
                  

                });
           

        }

    )}

    deleteItem() {
          
        //Delete logic
        $("#modal_item_delete_btn").on("click", (event) => {

            let currentItem = this.currentItemAfterEvent("data-btn-open");
            $("#edit_item_btn").attr('data-btn-open', currentItem.itemId);
            
            console.log(this.arrItems);      //arr
            console.log(currentItem.itemId); //item17

            let isTrue = confirm("Видалити? ТОЧНО?!?");

            if (isTrue) {
                this.arrItems = this.arrItems.filter(function(e) { return e.itemId !== currentItem.itemId 
                })
            console.log(`New this.arrItems: ${this.arrItems}`);


            //Send Data to Local Storage
            this.setDataToLocalStorage ("arrItems", this.arrItems);
            //Get Data from Local Storage
            this.getDataFromLocalStorage ("arrItems");
            
            //Parse Data to Items
            this.parseArrToClassItems (this.arrItems);
            // result - new this.arrItemsObj

            //Load Catalog with new this.arrItemsObj
            this.loadCatalog (this.arrItemsObj);
                
            }

        })
       
    }

    
        

    

}


const shop = new Shop("Shop", [], []);                                             //Створення магазину
const items = new Items();                                                         //Створення экземпляру классу Items для виклику методів
shop.shopTitle();  

//Load Catalog
    
shop.updateArrItemsObj();      
// shop.getDataFromLocalStorage ("arrItems");                                                                                                      
// shop.parseArrToClassItems (shop.arrItems);                                                 
    
items.loadCatalog (shop.arrItemsObj);       


//INFO
console.log("Local Storage in: ");
console.log(shop.arrItems);
console.log("Arr of Items: ");
console.log(shop.arrItemsObj);                             

shop.showMessage(`Кількість товарів в Local Storage - 
    ${shop.arrItems.length} шт \n
     на сумму ${shop.calcSum()} грн`
    , 2000);

//Events
shop.formData();   
shop.openModalWindowByButton( $("#btn_add_item"), $("#modal_item_add_edit") );     //Відкриття для редагування
shop.openModalWindowByButton( $("#btn_filter"), $("#modal_filter_id") );
shop.closeModalWindows();   
items.showItem();
