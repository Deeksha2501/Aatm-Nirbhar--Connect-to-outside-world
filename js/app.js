renderStars = (num) => {
  var innerHtml = "";
  for (var i = 0; i < Math.floor(num); i++) {
    innerHtml += '<ion-icon class="star" name="star"></ion-icon>';
  }
  if (Math.ceil(num) - num !== 0) {
    innerHtml += '<ion-icon class = "star" name="star-half"></ion-icon>';
  }
  return innerHtml;
};

getID = (id) => {
  document.getElementById('main-page').style.display = "none";
  document.getElementById('form-pop').style.display = "block";
  
      let cForm = document.getElementById('customer-form');
        console.log(cForm);
        console.log(id);
        cForm.addEventListener('submit' , e =>{
        e.preventDefault();
        let c_name = cForm.cname.value;
        let c_email = cForm.cemail.value;
        let c_num = cForm.cnum.value;
        let c_add = cForm.cadd.value;
        db.collection('Customers').add({
            f_id :id,
            Name : c_name,
            Email : c_email,
            Contact : c_num,
            Address : c_add
        }).then(()=>{
            alert('registered Succesfully');
            document.getElementById('main-page').style.display = "block";
            document.getElementById('form-pop').style.display = "none";
            location.replace('index.html')
            cForm.cname.value = '';
            cForm.cemail.value = '';
            cForm.cnum.value = '';
            cForm.cadd.value = '';
           
        })
}
)}


//showing services
let ul_list = document.querySelector(".facility-list");

function renderList(doc) {
  var html = ` <li class="facility-list__items" id="list_i" data-id = "${
    doc.id
  }">
                    <img src="${
                      doc.data().img_url
                    }" alt="" class="facility-list__items-img">
                    <div class="facility-list__items-rem">
                        <div class="facility-list__items-rem-name facility-items">${
                          doc.data().Name
                        }</div>
                        <div class="facility-list__items-rem-loc facility-items">${
                          doc.data().Location
                        }</div>
                        <div class="facility-list__items-rem-rating facility-items">${renderStars(
                          doc.data().Rating
                        )}</div>
                        <div class="facility-list__items-rem-type facility-items">Acceps online payment only</div>

                        <div class="facility-check-out">
                            <a  class="facility-link" onClick="getID('${
                              doc.id
                            }')" data-id = "${doc.id}">
                                Make a reservation &rarr;
                            </a>
                        </div>
                    </div>
                </li>`;
                if(ul_list && ul_list2){
                ul_list2.style.display = "none";
                ul_list.style.display = "block";  
                }
  if (ul_list) {
    ul_list.insertAdjacentHTML("beforeend", html);

  }
}

db.collection("Facilities").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type == "added") {
      renderList(change.doc);
    }
  });
});



const searchForm = document.querySelector('.search-form__form');

let ul_list2 = document.querySelector("#list1");
if(searchForm){
searchForm.addEventListener('submit' , e=>{
  if(ul_list || ul_list2){
  ul_list2.style.display = "block";
  ul_list.style.display = "none";
  }
  e.preventDefault();
  let s = searchForm.search.value;
  console.log(s);
  let S = s[0].toUpperCase() +  
  s.slice(1);
  console.log(S);
  ul_list2.innerHTML = '';
  db.collection("Facilities")
    .where('Name', '>=', S )
    .get()
    .then((snapshot) => {
      if(snapshot.docs.length == 0){
        renderList3();
      }
      snapshot.docs.forEach(data=>{
        renderList2(data);
      })
    });
})
}

function renderList2(doc) {
  var html = ` <li class="facility-list__items" id="list_i" data-id = "${doc.id}">
                    <img src="${
                      doc.data().img_url
                    }" alt="" class="facility-list__items-img">
                    <div class="facility-list__items-rem">
                        <div class="facility-list__items-rem-name facility-items">${
                          doc.data().Name
                        }</div>
                        <div class="facility-list__items-rem-loc facility-items">${
                          doc.data().Location
                        }</div>
                        <div class="facility-list__items-rem-rating facility-items">${renderStars(
                          doc.data().Rating
                        )}</div>
                        <div class="facility-list__items-rem-type facility-items">Acceps online payment only</div>

                        <div class="facility-check-out">
                            <a  class="facility-link" onClick="getID('${
                              doc.id
                            }')" data-id = "${doc.id}">
                                Make a reservation &rarr;
                            </a>
                        </div>
                    </div>
                </li>`;
  if (ul_list2) {

    ul_list2.insertAdjacentHTML("beforeend", html);

  }
}

renderList3 = () =>{
  var html = "Oops try with some different keyword!!"
  if (ul_list2) {
    ul_list2.insertAdjacentHTML("beforeend", html);
    ul_list2.style.fontSize = "20px";
  }
}




















































// let cForm = document.getElementById('customer-form');
// console.log(cForm);
// cForm.addEventListener('submit' , e =>{
// e.preventDefault();
// let id = getID();
// console.log(id);
// let c_name = cForm.cname.value;
// let c_email = cForm.cemail.value;
// let c_num = cForm.cnum.value;
// let c_add = cForm.cadd.value;
// db.collection('Customers').add({

//     Name : c_name,
//     Email : c_email,
//     Contact : c_num,
//     Address : c_add
// }).then(()=>{
//     // location.replace("index.html");
// })

// })

// var btn = document.getElementById('cust_redirect');
// if(btn){
// btn.addEventListener('click' , e=>{
//     // e.preventDefault();
//     console.log("tyg");
// })
// }

// db.collection('Facilities').get().then(snapshot => {
//     console.log('found');
//         snapshot.docs.forEach(doc => {

//         });
// });

//adding user data to firebase
// const signup = document.querySelector('.signup-form');
// signup.addEventListener('submit' , e=>{
//     e.preventDefault();
//     let added_name = signup.name.value;
//     let added_email = signup.email.value;
//     let added_loc = signup.loc.value;
//     let added_rating = signup.rating.value;
//     let id;
//     console.log({added_name , added_email , added_loc , added_rating});

//     db.collection('Facilities').add({
//         Name : added_name,
//         Email : added_email,
//         Location : added_loc,
//         Rating : added_rating,
//         img_url : 'abc'
//         }).then(doc =>{
//         id = doc.id;
//         })
// })
