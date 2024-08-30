import {
    db,
    doc,
    getDoc
}
from "../auth/firebase_Auth.js";

let detailBoxWrap = document.querySelector('.detailBoxWrap');
let DtailId = localStorage.getItem("blogID");

const Detail = async () => {
    console.log("blog id", DtailId)
    const docRef = doc(db, "BlogUsers", DtailId);
    const docSnap = await getDoc(docRef);

    const {BlogCategory, BlogDes, BlogerName, blogImg} = docSnap.data();

    console.log(BlogCategory);


    detailBoxWrap.innerHTML +=`
    <img src="${blogImg}" alt="">
    <p>${BlogCategory}</p>
    <h2>${BlogerName}</h2>
    <p>${BlogDes}</p>
    `;
}

Detail();