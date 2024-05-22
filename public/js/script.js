import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

// show-alert
const showAlert = document.querySelector("[show-alert]");

if(showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    console.log("a")
    showAlert.classList.add("alert-hidden");
  });
}
// End show-alert

// Sider Active 

function setActiveSidebarItem() {
  const currentURL = window.location.pathname; 
  const listButtonSider = document.querySelectorAll(".tablist .nav-item a");
  
  
  listButtonSider.forEach((button) => {
      const buttonURL = button.getAttribute("href"); 
      if (currentURL === buttonURL) {
          button.parentElement.classList.add("active"); 
      } else {
          button.parentElement.classList.remove("active"); 
      }
  });
}
function setActiveBoxNavItem() {
  const currentURL = window.location.pathname; 
  const listButtonNav = document.querySelectorAll(".nav-friends .box-nav .nav-item");
  if(listButtonNav.length > 0){
    const buttonSiderNav = document.querySelector(".tablist .nav-item a[href='/users/friends']");
    buttonSiderNav.parentElement.classList.add("active");
    listButtonNav.forEach((button) => {
      const buttonURL = button.querySelector("a").getAttribute("href"); 
      if (currentURL === buttonURL) {
        button.classList.add("active"); 
      } else {
        button.classList.remove("active"); 
      }
    });
  }
  
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarItem(); 
  setActiveBoxNavItem();
});
// End Sider Active 

// Scroll Chat To Bottom
const chatBody = document.querySelector(".main-chat");
if(chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}
// End Scroll Chat To Bottom

// Button Icon 
const buttonIcon = document.querySelector(".button-icon");

if(buttonIcon){
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener('click', () => {
    tooltip.classList.toggle("shown");
    console.log(buttonIcon)
  })
   
}
// End Button Icon 

// Button Upload Image 
// const formUploadImage = document.querySelector("[data-upload-id='upload-images']")
// const buttonUploadImage = document.querySelector("[button-upload-image]");
// if(buttonUploadImage) {
//   buttonUploadImage.addEventListener("click", () => {
//     formUploadImage.classList.remove("d-none")
//   })
// }

// const inputImage = document.querySelector("#file-upload-with-preview-upload-images");
// if(inputImage) {
//   inputImage.setAttribute("multiple", "true");
// }

// End Button Upload Image 

// emoji-picker
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker) {
  emojiPicker.addEventListener('emoji-click', event => {
    const icon = event.detail.unicode;
    const inputChat = document.querySelector(".footer-chat .inner-form input[name='content']");
    inputChat.value = inputChat.value + icon;
  });
}
// End emoji-picker

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".footer-chat .inner-form");
if(formChat){
  // Upload Images
  const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
  });
  // End Upload Images
  
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = formChat.content.value || "";
    const images = upload.cachedFileArray || [];
    if(content || images){
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images
      });
      formChat.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      upload.resetPreviewPanel();
    }
    
  })
}
// End CLIENT_SEND_MESSAGE

// SEVER_RETURN_MESSAGE
socket.on("SEVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".main-chat .inner-body");
  const myId = document.querySelector(".main-chat .inner-body").getAttribute("my-id");
  const div = document.createElement("div");

  let htmlContent = "";
  let htmlImages = "";

  if(myId == data.user_id) {
    div.classList.add("inner-outgoing")
    htmlContent +=
      `
        <div class="inner-content">${data.content}</div>
      `
    if(data.images.length > 0){ 
      htmlImages += `<div class="inner-images">`;

      data.images.forEach(image => {
        htmlImages += `
          <div class="inner-image">
            <img src="${image}">
          </div>
        `;
      })
      htmlImages += `</div>`;
      htmlContent += htmlImages;
    }
  }else {
    div.classList.add("inner-incoming")
    if(data.content){
      htmlContent += 
      `<div class="inner-avatar">
        <img src=${data.avatar} />
      </div>
      <div class="inner-right">
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-content">${data.content}</div>
     `
    }
    if(data.images.length > 0){ 
      htmlImages += `<div class="inner-images">`;

      data.images.forEach(image => {
        htmlImages += `
          <div class="inner-image">
            <img src="${image}">
          </div>
        `;
      })
      htmlImages += `</div>`;
    }
    htmlContent += htmlImages + `</div>`;
  }
  div.innerHTML = htmlContent;
  const elementListTyping = body.querySelector(".inner-list-typing");
  body.insertBefore(div, elementListTyping);

  new Viewer(div);

})
// End SEVER_RETURN_MESSAGE


// CLIENT_SEND_TYPING
var timeOut;
const inputChat = document.querySelector(".footer-chat .inner-form input[name='content']")
if(inputChat) {
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
  })
}
// End CLIENT_SEND_TYPING

// SERVER_RETURN_TYPING
const listTyping = document.querySelector(".inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
  if(data.type == "show") {
    const existBoxTyping = document.querySelector(`.box-typing[user-id="${data.userId}"]`);
    if(!existBoxTyping){
      const boxTyping = document.createElement("div");
      boxTyping.setAttribute("user-id", data.userId);
      boxTyping.classList.add("box-typing");
      if(data){
        let htmlTyping = 
        `
          <div class="inner-avatar"></div>
          <div class="inner-right">
            <div class="inner-name">${data.fullName}</div>
            <div class="inner-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        `
        boxTyping.innerHTML = htmlTyping;
        listTyping.appendChild(boxTyping);
      }
    }
  } else {
    const existBoxRemove = listTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
    if(existBoxRemove) {
      listTyping.removeChild(existBoxRemove);
    }
  }
  
})
// End SERVER_RETURN_TYPING


// Form Edit 
const formEdit = document.querySelector("[form-edit]");
if(formEdit){
  const listBtnEdit = formEdit.querySelectorAll(".button-edit");
  listBtnEdit.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("d-none");
      button.closest(".list-group-item").querySelector(".button-submit").classList.remove("d-none");
      button.closest(".list-group-item").querySelector("[input-edit]").classList.remove("d-none");
      button.closest(".list-group-item").querySelector(".name").classList.add("d-none");
    })
  })
  const listBtnSubmit = formEdit.querySelectorAll(".button-submit");
    listBtnSubmit.forEach((button) => {
      button.addEventListener("click", (e) => {
        const listGroupItem = button.closest(".list-group-item");
        if (listGroupItem) {
          button.classList.add("d-none");
          listGroupItem.querySelector(".button-edit").classList.remove("d-none");
          listGroupItem.querySelector("[input-edit]").classList.add("d-none");
          listGroupItem.querySelector(".name").classList.remove("d-none");
        }
      });
  });
  // Sự kiện thay đổi cho input file
  const avatarInput = document.querySelector("#avatar");
  avatarInput.addEventListener("change", () => {
    formEdit.submit();
  });
}
// Form Edit 

// Button Edit Image 
const uploadImageInput = document.querySelector("[upload-image-input]");
if(uploadImageInput){
  const buttonEditImage = document.querySelector(".button-edit-image");
  buttonEditImage.addEventListener("click", () => {
    uploadImageInput.click();
  })
}
// End Button Edit Image 

// Preview Image Chat 
const listImages = document.querySelectorAll(".main-chat .inner-images");
if(listImages.length > 0) {
  listImages.forEach((images) => {
    new Viewer(images);
  })  
}
// End Preview Image Chat 
