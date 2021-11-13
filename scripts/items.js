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
        
        rootCatalogPlace.innerHTML="";

        for (let i = 0; i < arr.length; i++) {
            rootCatalogPlace.insertAdjacentHTML("afterbegin",

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

            
        );  
        
    
        }  
    }

    uploadNewCatalog (arr) {
       
        const promise1 = new Promise((resolve, reject) => {
            //Send Data to Local Storage
            this.setDataToLocalStorage ("arrItems", arr);
            resolve(arr);
            
            console.log(`changes was send!`);
            reject("!!! AGAIN ERROR. Обыцянки-цяцянки");
          }).then((data) => {
            // data - this.arrItems
            //Get Data from Local Storage
            this.getDataFromLocalStorage ("arrItems");
            console.log(`We get data`);
          }).then((data) => {
    
            //Load Catalog with new this.arrItems
            this.loadCatalog (arr); 
            this.showItem();
          }).catch(alert);

          console.log(`uploadNewCatalog ${arr}`);

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

            console.log(`showItem ${currentItem.itemId}`);

            
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
                <input type="text" name="price" id="edit_item_price" placeholder="Price" pattern="\d+">
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

                console.log(`editItem ${currentItem.itemId}`);
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
                  console.log(this.arrItemsObj);
                  this.uploadNewCatalog (this.arrItems);
                  
                  

                });
           

        }

    )}

    deleteItem() {
          
        //Delete logic
        $("#modal_item_delete_btn").on("click", (event) => {

            let currentItem = this.currentItemAfterEvent("data-btn-open");
            $("#edit_item_btn").attr('data-btn-open', currentItem.itemId);
            
            console.log(`Current item: ${currentItem.itemId}`); //item17

            let isTrue = confirm("Видалити? ТОЧНО?!?");

            if (isTrue) {
                this.arrItems = this.arrItems.filter(function(e) { return e.itemId !== currentItem.itemId 
                })
            console.log(`New items count: ${this.arrItems.length}`);

            this.uploadNewCatalog (this.arrItems);

            console.log(`deleteItem ${currentItem}`);

            
            }

        })
       
    }

    filterWithPromise (searchArr) {

        const promise3 = new Promise((resolve, reject) => {
        
            
            resolve(searchArr);
            
            reject("!!! AGAIN ERROR. Обiцянки-цяцянки. Нова позиція");
          }).then((data) => {
            
            this.loadCatalog (data); 
            console.log(`filterWithPromise ${data}`);
          });
        
    }

    // searchItem () {
    //     $("#search_img").on("click", (event) => {
    //         console.log("search");

    //         let inputValue = $("#input_search_id").val();
    //         let searchArr = this.arrItems.filter(function(e) { return e.itemName == inputValue 
    //     })

    //         if ( searchArr.length > 0 ) {
    //             this.filterWithPromise (searchArr);
    //         } else {
    //             shop.showMessage(`Нічого не знайдено! Спробуйте ще!`, 2000);
    //         }
            
    //     })
    // }


    // searchItem () {
    //     $("#search_img").on("click", (event) => {
    //         let inputValue = $("#input_search_id").val();
    //         let searchArr = this.arrItems.filter(function(e) { return e.itemName == inputValue 
    //     })
    //     console.log(`search ${this.arrItems}`);
    //     console.log(`search ${searchArr}`);

    //     // this.sortItems (searchArr);

    //     if (inputValue !== []) {
    //         this.filterWithPromise (searchArr);
    //     } else {
    //         this.loadCatalog (this.arrItems);

    //     }
            
    //     })
    // }

    createNewArrWithFilter (prop, inputValue, arr) {
        let result;
        result = arr.filter((element) => { return element[prop] == inputValue 
        })
        console.log(`arrName ${result}`);
        return result;
    }

    sortByProp (prop, arr) {
        return arr.sort((a, b) => a[prop] > b[prop] ? 1 : -1);
    }


    sortCatalog (arr) {
        $("#sort_submit_id").on("click", (event) => {

            let inputValue = $("#select_filter_sort :selected").val();

            if ( inputValue == "by_name" ) {
                arr = this.arrItems;
                let prop = "itemName";
                this.sortByProp (prop, arr);
                arr.reverse();
                this.loadCatalog (arr);

            } else if ( inputValue == "by_price") {
                arr = this.arrItems;
                
                let prop = "itemPrice";
                arr.sort(function(a, b) {
                    return parseFloat(a[prop]) - parseFloat(b[prop]);
                });
                console.log(arr);
                arr.reverse();
                this.loadCatalog (arr);
                
    
            } else {
                console.log("Ошибка");
            }
            console.log(`sort ${ this.arrItems}`);
        })
    }

    // findAndLoad (btn, inputValue, prop, searchArr) {
    //     btn.on("click", (event) => {
    //         searchArr = this.createNewArrWithFilter (prop, inputValue, searchArr);
    //         // searchArr = this.arrItems.filter(function(e) { return e.itemCategory == inputValue})
    //         console.log(`filter ${this.arrItems}`);
    //         console.log(`filter ${searchArr}`);
    //     })
    // }

    searchItem() {
        $("#search_img").on("click", (event) => {
            let inputValue = $("#input_search_id").val();
            let searchArr = this.arrItems;
            let prop = "itemName";

            searchArr = this.createNewArrWithFilter (prop, inputValue, searchArr);

            console.log(`filter ${this.arrItems}`);
            console.log(`filter ${searchArr}`);

            // this.sortItems (searchArr);
            console.log(`searchArr - after search ${searchArr}`);

            if (searchArr.length > 0) {
                console.log("есть searchArr");
                this.filterWithPromise (searchArr);
            } else  {
                
                this.loadCatalog (this.arrItems);
            } 

        })

    }
    

    filterByCategory () {
        $("#filter_submit_id").on("click", (event) => {
            let inputValue = $("#select_filter_category :selected").val();
            let searchArr;
            let prop = "itemCategory";

            searchArr = this.createNewArrWithFilter (prop, inputValue, this.arrItems);
        
            console.log(`filter ${this.arrItems}`);
            console.log(`filter ${searchArr}`);

            // this.sortItems (searchArr);

            if (searchArr !== []) {
                this.filterWithPromise (searchArr);
            } else {

                shop.showMessage(`We dont have this! Try Again!`, 2000);
                this.loadCatalog (this.arrItems);
                this.showMessage(`Нічого не знайдено`, 2000);
                
            }
            
        })
    }

    

    

}

const items = new Items();   
items.loadCatalog (shop.arrItems);   

items.sortCatalog ();
items.searchItem();
items.formData();
items.showItem();
items.editItem ();
items.deleteItem();

items.filterByCategory();