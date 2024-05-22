const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    address: String, 
    statusOnline: String,
    status: {
        type: String,
        default: "active"
    },
    friendsList: [
        {
            user_id: String,
            room_chat_id: String
        }
    ],
    acceptFriends: Array,
    requestFriends: Array,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;