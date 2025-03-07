const socket = io("http://localhost:3000/");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const posts = document.getElementById("posts");
const searchInpt = document.getElementById("searchInpt");
const searchBtn = document.getElementById("searchBtn");
const searchParent = document.getElementById("searchParent");
const btn = document.getElementById("send-btn");
const updateBtn = document.getElementById("update-btn");

btn.addEventListener("click", addPost);

function addPost() {
  if (title.value != "" && desc.value != "") {
    let post = {
      title: title.value,
      desc: desc.value,
    };
    socket.emit("addPost", post);
    title.value = "";
    desc.value = "";
  } else {
    sweetAlert("warning", "fill all inputs please");
  }
}

socket.on("postSaved", (post) => {
  console.log(post);
  addAllPosts(post);
});

socket.on("allPosts", (allData) => {
  if (allData.length > 0) {
    addAllPosts(allData);
    searchParent.classList.remove("d-none");
    searchParent.classList.add("d-flex");
  } else {
    searchParent.classList.remove("d-flex");
    searchParent.classList.add("d-none");
  }
});

function addAllPosts(arrOfPost) {
  let cartona = "";
  for (let i = 0; i < arrOfPost.length; i++) {
    cartona += `
            <div class="col-md-3 mb-3">
                <div class="card p-3 text-center">
                    <h3>${arrOfPost[i].title}</h3>
                    <section class="mb-2">${arrOfPost[i].desc}</section>
                    <div class="d-flex gap-2">
                        <button onclick="removePost('${
                          arrOfPost[i]._id
                        }')" class="btn btn-danger w-50">delete</button>
                        <button onclick="editPost('${arrOfPost[i]._id}', '${encodeURIComponent(
                        JSON.stringify(arrOfPost[i])
                        )}')" class="btn btn-warning w-50">Edit</button>
                    </div>
                </div>
            </div>
        `;
  }
  posts.innerHTML = cartona;
}

function removePost(id) {
  console.log(id);
  socket.emit("deletePost", id);
  sweetAlert("success", "post deleted successfully");
  socket.on("allPostsAfterDelete", (allPosts) => {
    addAllPosts(allPosts);
  });
}

searchBtn.addEventListener("click", searcFun);

function searcFun() {
  socket.emit("searchTitle", searchInpt.value);
  socket.on("searchResult", (posts) => {
    if (Array.isArray(posts) && posts.length > 0) {
      addAllPosts(posts);
    } else {
      const postsContainer = document.getElementById("posts");
      if (postsContainer) {
        postsContainer.innerHTML = posts;
      }
    }
  });
}

let globalId = '';

function editPost(id, post) {
  console.log(id);
  updateBtn.classList.replace("d-none" , "d-block")
  btn.classList.replace("d-block" , "d-none")
  globalId = id;
  post = JSON.parse(decodeURIComponent(post));
  title.value = post.title;
  desc.value = post.desc;
}


updateBtn.addEventListener("click" , updatePost)

function updatePost(){
    console.log(globalId);
    updateBtn.classList.replace("d-block" , "d-none")
    btn.classList.replace("d-none" , "d-block");
    let post = {
        title: title.value,
        desc: desc.value,
        id: globalId
    }
    socket.emit("editPost" , post)
    title.value = "";
    desc.value = "";
    sweetAlert("success", "post updated successfully");

}

function sweetAlert(icon, msg){
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: icon,
        title: msg
      })
}