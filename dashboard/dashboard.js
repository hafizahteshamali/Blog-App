import {auth,onAuthStateChanged,signOut,db,collection,addDoc,getDocs,doc,deleteDoc, getDoc, updateDoc,
    storage, ref, uploadBytes, uploadBytesResumable, getDownloadURL
}
from "../auth/firebase_Auth.js";

let logoutBtn = document.getElementById('logoutBtn');

const Signout = () => {
    console.log("Signout");
    signOut(auth).then(() => {
        Toastify({
            text: "Logout Successfully",
            duration: 3000
        }).showToast();
        setTimeout(() => {
            StateChanging();
        }, 1000);
    }).catch((error) => {
        Toastify({
            text: error,
            duration: 3000
        }).showToast();
    });
}

logoutBtn.addEventListener('click', Signout);

const StateChanging = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "../index.html";
        }
    });
}


let BlogCreaterName = document.getElementById('BlogCreaterName');
let category = document.getElementById('category');
let blogDescription = document.getElementById('blogDescription');
let blogImage = document.getElementById('blogImage');
let addBtn = document.getElementById('addBtn');
let isUpdate = null;
let isUpdateImg = null;
let imgname = null;



let startBtn = document.getElementById('startBtn');
let stopBtn = document.getElementById('stopBtn');
let cancelBtn = document.getElementById('cancelBtn');
let imgProgress = document.getElementById('imgProgress');

const uploadImage = async () => {
    if (blogImage.files.length === 0) return;

    const img = blogImage.files[0];
    imgname = img.name;
    const imagesRefwithFolder = ref(storage, `images/${img.name}`);
    const uploadTask = uploadBytesResumable(imagesRefwithFolder, img);

    await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                imgProgress.innerText = 'Upload is ' + progress + '% done';
            }, 
            (error) => {
                imgProgress.innerText = 'Error: ' + error.message;
                reject(error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    isUpdateImg = downloadURL;
                    resolve();
                });
            }
        );
    });
};

blogImage.addEventListener('change', uploadImage);

let content = document.querySelectorAll('.contentTab');
let contentLinks = document.querySelectorAll('.header-btn a');

const switching = ()=>{
    contentLinks.forEach((tab, index)=>{
        tab.addEventListener('click', ()=>{
            content.forEach((cont)=>{
                cont.classList.remove('active');
            });
            contentLinks.forEach((tab)=>{
                tab.classList.remove('active');
            });
            content[index].classList.add('active');
            contentLinks[index].classList.add('active');
        });
    })
    Toastify({
        text: "switching the tab",
        duration: 3000
    }).showToast();
}

switching();

const AddBlogs = async () => {
    event.preventDefault();
    if (BlogCreaterName.value.trim() !== "" && category.value.trim() !== "" && blogDescription.value.trim() !== "") {
        try {
            if (blogImage.files.length > 0) {
                await uploadImage();
            }

            await addDoc(collection(db, "BlogUsers"), {
                BlogerName: BlogCreaterName.value,
                BlogCategory: category.value,
                BlogDes: blogDescription.value,
                blogImg: isUpdateImg,
                imgname: imgname
            });

            Toastify({
                text: "Add Data Successfully",
                duration: 3000
            }).showToast();

            BlogCreaterName.value = "";
            category.value = "";
            blogDescription.value = "";
            blogImage.value = "";
            imgProgress.innerText = '';

            await displayTableData();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}


addBtn.addEventListener('click', AddBlogs);


const GetData = async () => {
    let data = [];
    try {
        const querySnapshot = await getDocs(collection(db, "BlogUsers"));
        querySnapshot.forEach((doc) => {
            const blogData = {
                id: doc.id, ...doc.data()
            };
            data.push(blogData);
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
    }

    return data;
}


let DisplayblogBtn = document.getElementById('DisplayblogBtn');
let blogWrappper = document.getElementById('blog-wrappper');

const GetBlogs = (blogsData) => {
    blogWrappper.innerHTML = "";
    blogsData.forEach((blog) => {
        blogWrappper.innerHTML += `
            <div class="col-md-6">
                <div class="row card g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                    <div class="col p-4 d-flex flex-column position-static">
                        <strong class="d-inline-block mb-2 text-primary-emphasis">${blog.BlogCategory}</strong>
                        <h3 class="mb-0">${blog.BlogerName}</h3>
                        <div class="mb-1 text-body-secondary">Published Date: ${new Date().toDateString()}</div>
                        <p class="card-text mb-auto">${blog.BlogDes.slice(0, 50)}...</p>
                        <div id="blogBtns" class="btn-wrap">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editData('${blog.id}')">Edit</button>
                        <button onclick="deleteData('${blog.id}', this)">Delete</button>
                        <button onclick="detailData('${blog.id}', this)">View more...</button>
                    </div>
                    </div>
                    <div class="col-auto d-none d-lg-block">
                        <img src="${blog.blogImg || 'https://via.placeholder.com/200x250'}" alt="Blog Image" width="200" height="250">
                    </div>
                </div>
            </div>`;
    });
}


document.getElementById('DisplayblogBtn').addEventListener('click', async () => {
    const blogData = await GetData();
    GetBlogs(blogData);
});


const tableBody = document.getElementById('tableBody');

const displayTableData = async () => {
    const blogData = await GetData();
    tableBody.innerHTML = "";
    blogData.forEach(blog => {
        tableBody.innerHTML += `
            <tr>
                <td>${blog.BlogerName}</td>
                <td>${blog.BlogCategory}</td>
                <td>${blog.BlogDes.slice(0, 50)}...</td>
                <td>${blog.imgname || "No Image Available"}</td> <!-- Use the stored imgname -->
                <td>
                    <div class="btn-wrap">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editData('${blog.id}')">Edit</button>
                        <button onclick="deleteData('${blog.id}', this)">Delete</button>
                    </div>
                </td>
            </tr>`;
    });
}

document.getElementById('tableData').addEventListener('click', displayTableData);

let updateBlogerName = document.getElementById('updateBlogerName');
let updateCategory = document.getElementById('updateCategory');
let updateDescri = document.getElementById('updateDescri');
let updateBtn = document.getElementById('updateBtn');

window.editData = async (id) => {
    try {
        const currentData = await getDoc(doc(db, "BlogUsers", id));
        const { BlogerName, BlogCategory, BlogDes, blogImg } = currentData.data();
        updateBlogerName.value = BlogerName;
        updateCategory.value = BlogCategory;
        updateDescri.value = BlogDes;
        isUpdate = id;

        Toastify({
            text: "Edit Terminal Open",
            duration: 3000
        }).showToast();

        displayTableData();
        GetBlogs(blogsData);

    } catch (e) {
        console.log("Error fetching document: ", e);
    }
}

window.deleteData = async (id, button) => {
    button.innerHTML = "Deleting...";
    try {
        await deleteDoc(doc(db, "BlogUsers", id));
        Toastify({
            text: "Data Deleted Successfully",
            duration: 3000
        }).showToast();

        const blogsSnapshot = await getDocs(collection(db, "BlogUsers"));
        const blogsData = blogsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        displayTableData();
        GetBlogs(blogsData);
    } catch (e) {
        console.log(e);
    } finally {
        button.innerHTML = "Delete";
    }
};

window.detailData = (id) =>{
    localStorage.setItem("blogID", id);
    window.location.href = "./DetailPage.html";
}



const upDateData = async () => {
    event.preventDefault();
    try {
        await updateDoc(doc(db, "BlogUsers", isUpdate), {
            BlogerName: updateBlogerName.value,
            BlogCategory: updateCategory.value,
            BlogDes: updateDescri.value
        });

        Toastify({
            text: "Data Updated Successfully",
            duration: 3000
        }).showToast();

        await displayTableData();
        const blogData = await GetData();
        GetBlogs(blogData);

        updateBlogerName.value = "";
        updateCategory.value = "";
        updateDescri.value = "";
        updateblogImage.value = "";
    } catch (e) {
        console.log("Error updating document: ", e);
    }
}

updateBtn.addEventListener('click', upDateData);

