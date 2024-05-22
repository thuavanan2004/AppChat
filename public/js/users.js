// Chức năng gửi yêu cầu kết bạn
const listButtonAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listButtonAddFriend.length > 0) {
  listButtonAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("add")

        const userIdB = button.getAttribute("btn-add-friend");
        socket.emit("CLIENT_ADD_FRIEND", userIdB);
    })
  })
}
// Hết chức năng gửi yêu cầu kết bạn

// Chức năng hủy yêu cầu kết bạn 
const listButtonCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listButtonCancelFriend.length > 0) {
    listButtonCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");

            const userIdB = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
        })
    })
}
// Hết chức năng hủy yêu cầu kết bạn 

// Chức năng từ chối kết bạn
const deleteUser = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");

        const userIdB = button.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
    })
} 
const listButtonRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listButtonRefuseFriend.length > 0) {
    listButtonRefuseFriend.forEach(button => {
        deleteUser(button)
    })
}
// Hết chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn 
const acceptUser = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");

        const userIdB = button.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
    })
}
const listButtonAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listButtonAcceptFriend.length > 0) {
    listButtonAcceptFriend.forEach(button => {
        acceptUser(button);
    })
}
// Hết chức năng chấp nhận kết bạn 

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if(badgeUsersAccept) {
      badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const dataUserAccept = document.querySelector(`[data-users-accept='${data.userIdB}']`);
    if(dataUserAccept){
        console.log(dataUserAccept)
        const divBoxUser = document.createElement("div");
        divBoxUser.classList.add("box-user");
        divBoxUser.setAttribute("user-id", data.infoUserA._id)
        divBoxUser.innerHTML = 
        `
        <div class="inner-avatar">
                <img src=${data.infoUserA.avatar ?  data.infoUserA.avatar : "/images/avatar-default.jpg"} alt=${data.infoUserA.fullName}>
            </div>
            <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullName}</div>
                <div class="inner-buttons">
                    <button class="btn btn-sm btn-secondary mr-1" btn-accept-friend=${data.infoUserA._id} fdprocessedid="ncfjq8">Chấp nhận</button>
                    <button class="btn btn-sm btn-secondary" btn-refuse-friend=${data.infoUserA._id} fdprocessedid="465rc">Từ chối</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend disabled="disabled">Đã xóa</button>
                    <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend disabled="disabled">Đã chấp nhận</button>
                </div>
            </div>
        `
        dataUserAccept.appendChild(divBoxUser);
        // Bắt sự kiện cho nút Xóa
        const btnRefuseFriend = document.querySelector("[btn-refuse-friend]");
        deleteUser(btnRefuseFriend);

        // Bắt sự kiện cho nút Chấp nhận
        const btnAcceptFriend = document.querySelector("[btn-accept-friend]");
        acceptUser(btnAcceptFriend);
    }
    // Xóa A khỏi trang Danh sách người dùng của B
    console.log(data.userIdB);
    console.log(data.infoUserA._id);
    const dataUsersNotFriend = document.querySelector(`[user-id="${data.userIdB}"]`);
    if(dataUsersNotFriend) {
        const boxUserA = dataUsersNotFriend.querySelector(`[data-users-not-friend="${data.infoUserA._id}"]`);
        if(boxUserA) {
        dataUsersNotFriend.removeChild(boxUserA);
        }
    }
})
// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_CANCEL_FRIEND
socket.on("SERVER_RETURN_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if(dataUsersAccept) {
      const boxUserA = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
      if(boxUserA) {
        dataUsersAccept.removeChild(boxUserA);
      }
    }
});
// End SERVER_RETURN_CANCEL_FRIEND

// SEVER_RETURN_STATUS_ONLINE
socket.on("SEVER_RETURN_STATUS_ONLINE", (data) => {
    const boxUserUpdateStatus = document.querySelector(`.friends [user-id='${data.userId}']`)
    if(boxUserUpdateStatus) {
        const bagdeActive = boxUserUpdateStatus.querySelector(".inner-name [bagde-active]");
        if(data.statusOnline == "online"){
            bagdeActive.classList.add("bagde-active");
        }else { 
            bagdeActive.classList.remove("bagde-active");
        }
       
    }
})
// End SEVER_RETURN_STATUS_ONLINE