
//Магазин
class Shop {
    constructor(shopName, arrItems){
        this.shopName = shopName;
        this.arrItems = arrItems;
        
    }

    showMessage(message, time) {
        
        $("#modal_massege_id, .modal_massege_overlay").fadeIn();
        $("#modal_massege_text").text(message);

        setTimeout( () => {
            $(".modal_massege_overlay, #modal_massege_id").fadeOut();
        }, time);  
    }

    shopTitle () {
        rootShopTitle.innerHTML = this.shopName;     //Назва магазину
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
            console.log(`set data ${this.arrItems}`);
            return result;
        
    }

    calcSum() {
        
        let result = 0;
        for (let i = 0; i < this.arrItems.length; i++) {
            result += +this.arrItems[i]["itemPrice"];
        }
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
            // this.arrItems.push(result);

            this.arrItems.push(result);
            this.setDataToLocalStorage ("arrItems", this.arrItems);


            //this.getDataFromLocalStorage ("arrItems");

            const promise1 = new Promise((resolve, reject) => {
                //Send Data to Local Storage
                this.getDataFromLocalStorage ("arrItems");
                resolve(this.arrItems);
                console.log(`We ger new this.arrItems`);
                reject("!!! AGAIN ERROR. Обiцянки-цяцянки. Нова позиція");
              }).then((data) => {
                //Load Catalog with new this.arrItems
                this.loadCatalog (data); 
                this.showItem();
              });
            // this.parseArrToClassItems (this.arrItems);

            console.log(`FormData ${this.arrItems}`);

        }) 
    }

   
}



const shop = new Shop("Shop", []);                                             
                                
shop.shopTitle();  
    
shop.getDataFromLocalStorage ("arrItems");      
                                                
console.log(`base ${shop.arrItems}`);    

console.log("Local Storage in: ");
console.log(shop.arrItems);                            

shop.showMessage(`Кількість товарів в Local Storage - 
    ${shop.arrItems.length} шт \n
     на сумму ${shop.calcSum()} грн`
    , 2000);
   
shop.openModalWindowByButton( $("#btn_add_item"), $("#modal_item_add_edit") );     //Відкриття для редагування
shop.openModalWindowByButton( $("#btn_filter"), $("#modal_filter_id") );
shop.closeModalWindows();   



