//Auth status
const dashboard = document.getElementById("creater-dashboard");
const logoutText = document.getElementById("logout-text");
var updateDiv = document.getElementById("search-form-update");
var profile = document.getElementById("profile");
const signup = document.querySelector(".signup-form");
const logOut = document.querySelector("#log-out");
const login = document.querySelector(".login-form");


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

function upload_image(id) {
  const storage = firebase.storage().ref();
  const file = document.querySelector("#image-upload").files[0];
  console.log(file);
  const name = new Date() + "-" + file.name;

  const metadata = {
    contentType: file.type,
  };
  console.log(metadata.contentType);

  const task = storage.child(name).put(file, metadata);
  console.log({ id });
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      console.log({ url });
      console.log({id});
      db.collection("Facilities")
        .doc(id)
        .update({
        img_url: url,
      }).then((user)=>{
          alert("Signed In successfully");
          location.replace('creater-dashboard.html');
      })
    });
}

//Sign-up

if (signup != null) {
  signup.addEventListener("submit", (e) => {
    e.preventDefault();
    //get user info
    const email = signup["signup-email"].value;
    const pass = signup["signup-pass"].value;
    console.log(email, pass);
    auth.createUserWithEmailAndPassword(email, pass).then((cred) => {
      console.log(cred.user);
    });
    let added_name = signup.name.value;
    let added_email = signup.email.value;
    let added_loc = signup.loc.value;
    let added_rating = signup.rating.value;
    let id;
    console.log({ added_name, added_email, added_loc, added_rating });

    db.collection("Facilities")
      .add({
        Name: added_name,
        Email: added_email,
        Location: added_loc,
        Rating: added_rating,
        img_url: "abc",
      })
      .then((doc) => {
        id = doc.id;
        upload_image(id);
      });
    console.log({ id });

    //sign up the user
  });
}

//logout
if (logOut != null) {
  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      alert("You are logged out Successfully!");
      location.replace("creater-dashboard.html");
    });
  });
}

if (login != null) {
  login.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = login["login-email"].value;
    const pass = login["login-pass"].value;

    auth.signInWithEmailAndPassword(email, pass).then((cred) => {
      console.log(cred.user);
      location.replace("creater-dashboard.html");
    });
  });
}

createProfile = (data) => {
  if(data){
var html = `<img src="${data.data().img_url}" alt="" class="profile-img">
                  <div class="profile-box">
                      
                      <div class="entry">
                          <div class="entry-name">Name of Firm</div>
                          <span class="colon">:</span>
                          <div class="entry-value">${data.data().Name}</div>
                      </div>
                      <div class="entry">
                          <div class="entry-name">Email of owner</div>
                          <span class="colon">:</span>
                          <div class="entry-value">${data.data().Email}</div>
                      </div>
                      <div class="entry">
                          <div class="entry-name">Location of Firm</div>
                          <span class="colon">:</span>
                          <div class="entry-value">${
                            data.data().Location
                          }</div>
                      </div>
                      <div class="entry">
                          <div class="entry-name">Rating</div>
                          <span class="colon">:</span>
                          <div class="entry-value">
                          ${renderStars(data.data().Rating)}
                          </div>
                      </div>
                      <div class="entry">
                          <div class="entry-name"></div>
                          <div class="colon"></div>
                          <div class="entry-value"></div>
                      </div>
                  </div>`;
if (profile) {
  profile.insertAdjacentHTML("beforeend", html);
}
}
};

getCostumers = (data) => {
  let ul_cust = document.getElementById("cust_list");
  // ul_cust.innerHTML = '';
  // db.collection("Customers")
  //   .where("f_id", "==", data.id)
  //   .get()
  //   .then((snapshot) => {
  //     data = snapshot.docs.forEach((doc) => {
  //       renderCustomer(doc);
  //     });
  //   });

  db.collection('Customers')
  .where("f_id", "==", data.id)
  .onSnapshot((snapshot)=>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
          let noCust = document.querySelector('#no-cust');
          if(noCust){
          noCust.style.display = "none";
          }
          renderCustomer(change.doc);         
        }
        else if(change.type == 'removed'){
            let li = document.querySelector('[data-id=' + change.doc.id + ']');
            console.log(li);
            if(ul_cust){
            ul_cust.removeChild(li);
            }
        }

    })
})
};

renderCustomer = (d) => {
  let ul_cust = document.getElementById("cust_list");
  let doc = d.data();
  console.log(ul_cust);
  if(ul_cust){
  let html = `  <div class="entry-name">Name</div> : <div class="entry-value">${doc.Name}</div>
                <div class="entry-name">Email</div> : <div class="entry-value">${doc.Email}</div>
                <div class="entry-name">Contact Details</div> : <div class="entry-value">${doc.Contact}</div>
                <div class="entry-name">Address</div>: <div class="entry-value">${doc.Address}</div>
                `;
  let li = document.createElement('li');
  li.id = 'customer_item';
  li.setAttribute('data-id' , d.id);
  cross = document.createElement('span');
  cross.id = "delete";
  cross.innerHTML = 'Delete Customer';
  li.insertAdjacentHTML('afterbegin' ,html);
  li.appendChild(cross);
    ul_cust.appendChild(li);
  // ul_cust.insertAdjacentHTML("beforeend", html);
  }
  if(cross){
  cross.addEventListener("click", (e) => {
    console.log('bfek');
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection('Customers').doc(id).delete();
    console.log(id);
  });
}
};

let cross = document.getElementById("delete");
if (cross) {
  
}

update = (d) => {
  let data = d.data();
  let html = `<form action="" class="search-form__form" id ="update-form" data-id="${d.id}" autocomplete="off">
                    <input type="name" name="name" id="signup-name" class="search-form__input search-form__input-login "
                        placeholder="Enter your Firm Name" required value="${data.Name}">
                    <label for="signup-name" class="search-form__label search-form__label-login"></label><br>
                    <input type="text" name="loc" id="signup-loc" class="search-form__input search-form__input-login "
                        placeholder="Location of Firm" required value="${data.Location}">
                    <label for="signup-loc" class="search-form__label search-form__label-login"></label><br>
                    <input type="number" name="rating" id="signup-rating"
                        class="search-form__input search-form__input-login " placeholder="Enter the Rating of firm out of 5"
                        required max="5" min="1" step=".5" value="${data.Rating}">
                    <label for="signup-rating" class="search-form__label search-form__label-login"></label><br>
          
                    <button type="submit">Submit</button>
                </form>`;
  if (updateDiv) {
    updateDiv.insertAdjacentHTML("beforeend", html);
    const updateForm = document.getElementById("update-form");
    var id = updateForm.getAttribute("data-id");
    updateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let added_name = updateForm.name.value;
      let added_loc = updateForm.loc.value;
      let added_rating = updateForm.rating.value;
      console.log({ added_name, added_loc, added_rating });
      db.collection("Facilities")
        .doc(id)
        .update({
          Name: added_name,
          Location: added_loc,
          Rating: added_rating,
        })
        .then(() => {
          location.replace("creater-dashboard.html");
        });
    });
  }
};


getUser = (email) => {
  db.collection("Facilities")
    .where("Email", "==", email)
    .get()
    .then((snapshot) => {
      data = snapshot.docs[0];
      createProfile(data);
      update(data);
      getCostumers(data);
    });
};


auth.onAuthStateChanged((user) => {
  if (user) {
    if (dashboard && logoutText) {
      dashboard.style.visibility = "visible";
      logoutText.style.visibility = "hidden";
      logoutText.style.display = "none";
    }
    getUser(user.email);
  } else {
    if (dashboard && logoutText) {
      dashboard.style.visibility = "hidden";
      logoutText.style.display = "block";
      logoutText.style.visibility = "visible";
      dashboard.style.display = "none";
    }
    console.log("logged out");
  }
});

// db.collection('Customers').onSnapshot((snapshot)=>{
//   let changes = snapshot.docChanges();
//   changes.forEach(change =>{
//       if(change.type == 'added'){
//           renderCafe(change.doc);         
//       }
//       else if(change.type == 'removed'){
//           let li = document.querySelector('[data-id=' + change.doc.id + ']');
//           console.log(li);
//           cafeList.removeChild(li);
//       }

//   })
// })

var del_cust = document.getElementById('Delete_Account');
if(del_cust){
  del_cust.addEventListener('click' , e=>{
    var user = auth.currentUser;
    let email = user.email;
    console.log(user.email);
    user.delete()
    .then(()=> {
      db.collection("Facilities")
      .where("Email", "==", email)
      .get()
      .then((snapshot) => {
        data = snapshot.docs[0];
        console.log(data.id);
        db.collection('Facilities').doc(data.id).delete()
        .then(()=>{
          auth.onAuthStateChanged((user)=>{
            if(user === null){
                alert("Account Deleted Successfully! Redirecting to homepage!");
                location.replace('index.html');
            }
        });
      });
    })
    });

  })
}