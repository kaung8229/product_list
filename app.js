// GET UI

const uiitemsbox = document.querySelector(".itemsbox");

const uicartitemquantity = document.querySelector(".quantity");
const uicartitemsbox = document.querySelector(".cartitemsbox .cartitems");
// const uicartemptyhover = document.querySelector(".emptyhover");
const uicarttotalbox = document.querySelector(".totalbox");
const uicarttotalprice = document.querySelector(".cartitemsbox .totalprice");
const uicartconfirmbtn = document.querySelector(".confirmbtn");

const uiconfirmoverlay = document.querySelector(".confirmoverlay");
const uiconfirmitemsbox = document.querySelector(".confirmitemsbox .confirmitems");
const uiconfirmtotalprice = document.querySelector(".confirmitemsbox .totalprice");




let cartitemsdata = [];
let totalitemscount = 0; // use for cart box item quantity
let totalprice = 0; // use for cart box and confirm box

async function fetchlocaldatajson(){
    let getresponse = await fetch("./data.json");
    let getjson = await getresponse.json();

    return getjson;
}

fetchlocaldatajson()
    .then((datas)=>{
        // console.log(datas);

        datas.forEach((data,idx)=>{
            let newdiv = document.createElement("div");
            newdiv.className = "items";
            newdiv.innerHTML = `
            <div class="itemimg">
                <img src="${data.image.desktop}" alt="">
            </div>
            <div class="addtocart">
                <button type="button" class="addtocartbtn" onclick="selectitemfun(event,${idx})">
                    <img src="./assets/images/icon-add-to-cart.svg" alt="">
                    <span>Add to Cart</span>
                </button>
                <div class="qtybox" data-count="1">
                    <a href="javascript:void(0);" class="count" onclick="updatecartitemsfun(event,${idx})">
                        <ion-icon name="remove-outline"></ion-icon>
                    </a>
                    <span class="qty">1</span>
                    <a href="javascript:void(0);" class="count" onclick="updatecartitemsfun(event,${idx})">
                        <ion-icon name="add-outline"></ion-icon>
                    </a>
                </div>
            </div>
            <p class="category">${data.category}</p>
            <p class="name">${data.name}</p>
            <p class="price">$ <span>${data.price.toFixed(2)}</span></p>
            `;

            uiitemsbox.appendChild(newdiv);
        })

    })
    .catch((err)=>{
        console.log("Can't fetch data - " + err);
    })

function selectitemfun(e,itemid){
    let img = e.target.parentElement.previousElementSibling;
    let qtybox = e.target.nextElementSibling;
    // console.log(qtybox);
    qtybox.classList.add("active");
    img.classList.add("active");
    additemtocartfun(e.target,itemid);
}

function additemtocartfun(ele,itemid){
    let itemimg = ele.parentElement.previousElementSibling.children[0].src;
    let itemname = ele.parentElement.parentElement.children[3].innerText;
    let itemprice = +ele.parentElement.parentElement.children[4].children[0].innerText;
    let itemqty = +ele.nextElementSibling.getAttribute("data-count");
    // console.log(itemname,itemprice,itemqty);

    totalitemscount += itemqty;
    uicartitemquantity.innerText = totalitemscount;

    let itemdata = {
        itemid,
        itemimg,
        itemname,
        itemprice,
        itemqty,
        qtyprice: itemqty * itemprice
    };

    cartitemsdata.push(itemdata);
    // console.log(cartitemsdata);

    manipulatehtmlcart(cartitemsdata);
    uicarttotalbox.classList.add("active");
}

function updatecartitemsfun(e,itemid){
    // console.log(e.target.name);
    let img = e.target.parentElement.parentElement.previousElementSibling;
    let qtybox = e.target.parentElement;
    let qty = e.target.parentElement.children[1];
    let getcount = +qtybox.getAttribute("data-count");
    if(e.target.children[0].name === 'add-outline'){
        getcount++;
        totalitemscount++;
        qtybox.setAttribute("data-count",getcount);
        qty.innerText = getcount;
        cartitemsdata = cartitemsdata.map(cartitem=>{
            if(cartitem.itemid === itemid){
                cartitem.itemqty = getcount;
                cartitem.qtyprice = getcount * cartitem.itemprice;
            }
            return cartitem;
        })
        // console.log(getcount);
        // console.log(cartitemsdata);
        manipulatehtmlcart(cartitemsdata);
    }else{
        getcount--;
        totalitemscount--;
        if(getcount != 0){
            qtybox.setAttribute("data-count",getcount);
            qty.innerText = getcount;
            cartitemsdata = cartitemsdata.map(cartitem=>{
                if(cartitem.itemid === itemid){
                    cartitem.itemqty = getcount;
                    cartitem.qtyprice = getcount * cartitem.itemprice;
                }
                return cartitem;
            })
            manipulatehtmlcart(cartitemsdata);
        }else{
            qtybox.classList.remove("active");
            img.classList.remove("active");
            cartitemsdata = cartitemsdata.filter(cartitem=>{
                if(cartitem.itemid !== itemid){
                    return cartitem;
                }
            })
            manipulatehtmlcart(cartitemsdata);
            if(cartitemsdata.length === 0){
                manipulatehtmlemptybox();
                uicarttotalbox.classList.remove("active");
            }
        }
    }
}

function deletecartitemsfun(itemid){
    // console.log(e.target);
    // console.log(itemid);
    let items = document.querySelectorAll(".items");

    let img = items[itemid].children[0];
    let qtybox = items[itemid].children[1].children[1];

    totalitemscount -= +qtybox.getAttribute("data-count");
    img.classList.remove("active");
    qtybox.classList.remove("active");
    qtybox.setAttribute("data-count",1);

    cartitemsdata = cartitemsdata.filter(cartitem=>{
        if(cartitem.itemid !== itemid){
            return cartitem;
        }
    })
    manipulatehtmlcart(cartitemsdata);
    if(cartitemsdata.length === 0){
        manipulatehtmlemptybox();
        uicarttotalbox.classList.remove("active");
    }
}

function manipulatehtmlcart(datas){
    uicartitemsbox.innerHTML = "";
    datas.forEach((data)=>{
        let newdiv = document.createElement("div");
        newdiv.className = "cartitem";
        newdiv.innerHTML = `
            <div class="info">
                <p>${data.itemname}</p>
                <p><span class="qtycount">${data.itemqty}x</span> @ <span class="itemprice">$${data.itemprice}</span> - <span class="qtyprice">$${data.qtyprice.toFixed(2)}</span></p>
            </div>
            <a href="javascript:void(0);" class="del-item" onclick="deletecartitemsfun(${data.itemid})">
                <ion-icon name="close-circle-outline"></ion-icon>
            </a>
        `;
        // console.log(newdiv);

        uicartitemsbox.appendChild(newdiv);
    })
    uicartitemquantity.innerText = totalitemscount;
    totalprice = datas.reduce((total,curValue)=>{
        // console.log(total);
        // console.log(curValue.qtyprice);
        total += curValue.qtyprice;
        return total;
    },0);
    uicarttotalprice.innerText = "$" + totalprice.toFixed(2);
}

function manipulatehtmlemptybox(){
    uicartitemsbox.innerHTML = "";
    let emptydiv = document.createElement("div");
    emptydiv.className = "emptyhover";
    emptydiv.innerHTML = `
        <img src="./assets/images/illustration-empty-cart.svg" alt="">
        <p>Your added items will appear here</p>
    `;
    uicartitemsbox.appendChild(emptydiv);
}


uicartconfirmbtn.addEventListener("click",confirmitemsboxfun);

function confirmitemsboxfun(){
    uiconfirmoverlay.classList.add("active");
    uiconfirmitemsbox.innerHTML = "";
    cartitemsdata.forEach((data=>{
        let newdiv = document.createElement("div");
        newdiv.className = "confirmitem";
        newdiv.innerHTML = `
        <div class="thumbnailimg">
            <img src="${data.itemimg}" alt="">
        </div>
        <div class="info">
            <p>${data.itemname}</p>
            <p><span class="qtycount">${data.itemqty}x</span> @ <span class="itemprice">$${data.itemprice}</span></p>
        </div>
        <div class="qtyprice">$${data.qtyprice.toFixed(2)}</div>
        `;

        uiconfirmitemsbox.appendChild(newdiv);
    }))
    uiconfirmtotalprice.innerText = "$" + totalprice.toFixed(2);
}


function startneworderfun(){
    window.location.reload();
}





