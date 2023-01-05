//Storage Controller
const StorageCtrl = (function(){
    //public methods
    return {
        storeItem: function (item){
            let items;
            // check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                console.log(item)
                //push new item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else{
                //get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.push(item);
                //reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function (){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        changeItemFromStorage: function (id, newItem){
            if(localStorage.getItem("items") === null){

            }else {
                let items;
                items = JSON.parse(localStorage.getItem("items"))
                items[id]=newItem
                localStorage.setItem("items", JSON.stringify(items))
            }
        }
    }
})();
// Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function (id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Data Structure
    const data = {
        items: [
         //{id: 0, name: 'Steak Dinner', calories: 1200},
         //{id: 1, name: 'Cookie', calories: 400},
         //{id: 2, name: 'Eggs', calories: 300}   
        ],
        total: 0,
        currentItem: null
    }

    return {
        getItems: function(){
            return data.items
        },
        addItem: function (name, calories){
            let ID;
            //create ID
            if(data.items.length >0){
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }
            // calories to number
            calories = parseInt(calories);
            //create new item
            newItem = new Item(ID, name, calories);
            //add to items array
            data.items.push(newItem);
            //return new item
            return newItem
        },
        getTotalCalories: function (){
            let total = 0;
            //loop through items and add calories
            data.items.forEach(function(item){
                total = total + item.calories;
                console.log(total)
            });
            // set total calories in data structure
            data.total = total;
            //return total
            return data.total;
        },
        logData: function (){
            return data
        },
        changeName: function (name){
            this.name = name
        },
        changeCalorie: function (calories){
            this.calories = calories
        }
    }
})();


// UI Controller
const UICtrl = (function(){
        //UI selectors
        const UISelectors = {
            itemList: '#item-list',
            itemNameInput: '#item-name',
            itemCaloriesInput: '#item-calories',
            addBtn: '.add-btn',
            updateBtn: '.update-btn',
            totalCalories: '.total-calories'
        }
    return {
        populateItemList: function (items){
            // create html content
            let html = '';

            // parse data and create list items html
            items.forEach(function (item){
                html += `<li class="collection-item" id="item-${item.id}"><strong id="toit">${item.name}:</strong><em id="kalor">${item.calories} Calories</em>
                         <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                         </a>
                         </li>`;
    });

            // insert list items
            document.quertySelector(UISelectors.itemList).innerHTML = html;

        },
        getSelectors: function (){
            return UISelectors;
        },
        getItemInput: function (){
            return{
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item){
            // create li element
            const li = document.createElement("li");
            //add class
            li.className = "collection-item";
            //add ID
            li.id = `item-${item.id}`;
            // add HTML
            li.innerHTML= `<strong id="toit">${item.name}:</strong>
                <em id="kalor">${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        setInput: function(name, calories){
            document.querySelector(UISelectors.itemNameInput).value = name;
            document.querySelector(UISelectors.itemCaloriesInput).value = calories;

        },
        showTotalCalories: function (totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;

        }
    }
})();

// App Controller
const App = (function (ItemCtrl,StorageCtrl, UICtrl){
     // Load event listeners
     const loadEventListeners = function(){
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.querySelector("ul").addEventListener("click", itemMealUpdate);
        document.querySelector(UISelectors.updateBtn).addEventListener("click", mealUpdate);
        // add document reload event
        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
    }
    // item add submit function
    const itemAddSubmit = function (event){
        // get form input from UI Controller
        const input = UICtrl.getItemInput()
        //check for name and calorie input
        console.log(input)
        if(input.name !=='' && input.calories !== ''){
           const newItem = ItemCtrl.addItem(input.name, input.calories)
            console.log(newItem)
            //add item to UI items list
            UICtrl.addListItem(newItem)
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // store in localstorage
            StorageCtrl.storeItem(newItem);
            //clear fields
            UICtrl.clearInput();
        }
        event.preventDefault()
    }
    const itemMealUpdate = function (event){
        const UISelectors = UICtrl.getSelectors()
        if(event.target.className === "edit-item fa fa-pencil"){
            document.querySelector(UISelectors.updateBtn).style.display="inline"
            document.querySelector(UISelectors.addBtn).style.display="none"
            event.target.parentElement.parentElement.id = "item-update"

            const name = event.target.parentElement.parentElement.querySelector('#toit').textContent.slice(0, -1)
            const calories = event.target.parentElement.parentElement.querySelector('#kalor').textContent.slice(0, -9)

            UICtrl.setInput(name, calories)
        }
    }

    const mealUpdate = function (){
        const input = UICtrl.getItemInput()
        const UISelectors = UICtrl.getSelectors()
        const newItem = ItemCtrl.addItem(input.name, input.calories)
        if (input.name !== '' && input.calories !== ''){
            const list = document.querySelector("#item-list")
            var nodes = Array.from(list.children)
            newID = nodes.indexOf(document.querySelector("#item-update"))
            const updateItem = `<strong id="toit">${newItem.name}: </strong> <em id="kalor">${newItem.calories} Calories</em> <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            document.querySelector("#item-update").innerHTML = updateItem
            document.querySelector("#item-update").id = `item-${newID}`
            newItem.id = newID
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            StorageCtrl.changeItemFromStorage(newID, newItem)
            UICtrl.clearInput()
            document.querySelector(UISelectors.addBtn).style.display="inline"
            document.querySelector(UISelectors.updateBtn).style.display="none"


        }
    }

        // get items from storage
        const getItemsFromStorage = function (){
        //get items from storage
        const items = StorageCtrl.getItemsFromStorage()
        // set storage item to itemCtrl data items
        items.forEach(function (item){
        ItemCtrl.addItem(item['name'], item['calories'])
        })
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calries to UI
        UICtrl.showTotalCalories(totalCalories);
        // populate items list
        UICtrl.populateItemList(items)
        }
    return {
        init: function (){
            console.log('Initializing App')
            // fetch items from data structure
            const items = ItemCtrl.getItems()
            // populate items list
            UICtrl.populateItemList(items)
            //load event listeners
            loadEventListeners();
    }
}
}) (ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init()