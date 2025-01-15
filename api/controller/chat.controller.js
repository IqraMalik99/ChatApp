import { ApiError } from "../utilities/ApiError.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { chat, Chat } from "../schema/chat.schema.js";
import { Responce } from "../utilities/Responce.js";
import { emitEvent } from "../utilities/Event.js";
import { User } from "../schema/user.schema.js";
import { cloudinaryUploader } from "../utilities/cloudinary.js";
import { Message } from "../schema/message.schema.js";
import { ALERT, REFETCH_CHATS } from "../constansts/EventName.js";
import { deleteCloudinary } from "../utilities/deleteCloudinary.js";
import mongoose from "mongoose";
import { io } from '../app.js';
import { userSocketsIds } from "../app.js";

const getValidSockets = (members) => {
  if (!Array.isArray(members)) {
    console.error("Invalid members data. Expected an array, got:", members);
    return [];
  }
  return members
    .map((memberId) => userSocketsIds.get(memberId?.toString())) // Safely access memberId
    .filter(Boolean); // Remove undefined or null socket IDs
};

export const newGroup = AsyncHandler(async (req, res, next) => {
  try {
    let { name, members } = req.body;
    if (!name || members.length < 1) {
      throw new ApiError("name and members is required");
    }
    let grouped = members.length > 1;
    let groupedCreation = await Chat.create({
      name,
      isGrouped: grouped,
      members: [...members, req.user?._id],
      creator: req.user?._id
    });

    if (!groupedCreation) {
      throw new ApiError(400, "Does not create group");
    }


    let otherUser = req.body.members;
    let all = [...members, req.user._id];
    console.log(`other user :${otherUser}`);
    console.log(`all :${all}`);
    console.log(`me : ${req.user._id}`)

    emitEvent(req, ALERT, all, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, otherUser);
    return res.status(200).json(new Responce(groupedCreation, "Sucessfully created group", 200));
  } catch (error) {
    next(new ApiError(404, "error in creating group : ", error.message))
  }
})

export const getChats = AsyncHandler(async (req, res, next) => {
  console.log(req.user);

  try {
    let myChats = await Chat.aggregate([
      {
        $match: {
          members: req.user._id
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "datamembers",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      }
      ,
      {
        $addFields: {
          members: "$datamembers"
        }
      }
      ,
      {
        $project: {
          name: 1,
          members: 1,
          isGrouped: 1,
          creator: 1,
          _id: 1
        }
      }
    ])
    if (!myChats) {
      throw new ApiError(400, "not getting chat list");
    }
    return res.status(200).json(myChats, "sucess", 200);
  } catch (error) {
    throw new ApiError(400, "not getting chat list", error);
  }
});

export const getGroups = AsyncHandler(async (req, res, next) => {
  try {
    let myChats = await Chat.aggregate([
      {
        $match: {
          creator: req.user._id
        }
      },
      {
        $match: {
          isGrouped: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "datamembers",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      }
      ,
      {
        $addFields: {
          members: "$datamembers"
        }
      }
      ,
      {
        $project: {
          datamembers: 0
        }
      }
    ])
    if (!myChats) {
      throw new ApiError(400, "ot getting chat list");
    }
    return res.status(200).json(myChats, "sucess", 200);
  } catch (error) {
    throw new ApiError(400, "not getting chat list", error);
  }
})

export const addmember = AsyncHandler(async (req, res, next) => {
  let { chatId, member } = req.body;
  let getChat = await Chat.findById(chatId);
  if (!getChat) {
    throw new ApiError(400, "not getting chat");
  }
  if (!getChat.isGrouped) {
    throw new ApiError(400, "this is not a group chat");
  }
  if (getChat.creator.toString() !== req.user?._id.toString()) {
    throw new ApiError(404, "your are not authenticated a add member");
  }
  let username = member.map((user) => User.findById(user, "username"));
  let newName = await Promise.all(username);
  let uniqueId = newName.filter((user) => !getChat.members.includes(user._id.toString())).map((user) => user._id);
  getChat.members.push(...uniqueId);
  let addUserName = newName.map((i) => i.name).join(",")
  await getChat.save();
  emitEvent(req, "Alert", getChat.members, `${addUserName} has beem added to group`);
  emitEvent(req, "Refetched Chat", getChat.members);

  return res.status(200).json(new Responce(getChat, "Sucessfully added member", 200))
})

export const removeMember = AsyncHandler(async (req, res, next) => {
  let { chatId, member } = req.body;
  let getChat = await Chat.findById(chatId);
  if (!getChat) {
    throw new ApiError(400, "not getting chat");
  }
  if (!getChat.isGrouped) {
    throw new ApiError(400, "this is not a group chat");
  }
  if (getChat.creator.toString() !== req.user?._id.toString()) {
    throw new ApiError(404, "your are not authenticated a add member");
  }
  let usersLength = getChat.members.length - member.length
  if (usersLength <= 2) {
    throw new ApiError(404, "We cannot remove member because  member is become less than 3");
  }
  let removedUser = getChat.members.filter((user) => !member.includes(user._id.toString()));
  let username = member.map((user) => User.findById(user, "username"));
  let removedUserName = await Promise.all(username);
  removedUserName = removedUserName.map((i) => i.name).join(",")
  getChat.members = removedUser;
  await getChat.save();
  emitEvent(req, "Alert", getChat.members, `${removedUserName} has beem removed to group`);
  emitEvent(req, "Refetched Chat", getChat.members);
  return res.status(200).json(new Responce(getChat, "Sucessfully removed member", 200))
})
export let leaveGroup = AsyncHandler(async (req, res, next) => {
  try {
    let chatId = req.params.id;
    let getChat = await Chat.findById(chatId);
    if (!getChat) {
      throw new ApiError(400, "not getting chat");
    }
    if (!getChat.isGrouped) {
      throw new ApiError(400, "this is not a group chat");
    }
    if (req.user?._id.toString() === getChat.creator.toString()) {
      getChat.creator = getChat.members[0];
      await getChat.save();
    }
    let newMembers = getChat.members.filter((user) => !(user.toString() === req.user?._id.toString()));
    getChat.members = newMembers;
    await getChat.save();
    let leftUser = await User.findById(req.user?._id, "username");
    emitEvent(req, "Alert", getChat.members, `${leftUser} has been left to group `);
    emitEvent(req, "Refetched Chat", getChat.members);
  } catch (error) {
    throw new ApiError(404, "failed to leave Group ", error.message)
  }
})
export let getChatDetails = AsyncHandler(async (req, res, next) => {
  try {
    // check if query.populate is true if true
    // give chat info which memeber populate else give chat info
    let chatId = req.params.id;
    let chat = await Chat.findById(chatId).populate("members", "username avatar").lean();
    if (!chat) {
      throw new ApiError(400, "Not getting chat from given Id");
    }
    res.status(200).json(new Responce(chat, "Sucess", 200))

  } catch (error) {
    throw new ApiError(400, "Getting error in chat Details  :", error)
  }
})
export let renameGroup = AsyncHandler(async (req, res, next) => {
  try {
    let { chatId } = req.params;
    let { name } = req.body;
    let chat = await Chat.findById(chatId).populate("members", "username avatar");
    if (!chat) {
      throw new ApiError(400, "Not getting chat from given Id");
    }
    if (!chat.isGrouped || chat.creator !== req.user?._id) {
      throw new ApiError(400, "You cannot change name bcz either is not a group or you are not a admin");
    }
    chat.name = name;
    await chat.save();
    res.status(200).json(new Responce(chat, "Success", 200));
  } catch (error) {
    throw new ApiError(400, "Getting error in reame Group :", error)
  }
})
export let deleteChat = AsyncHandler(async (req, res, next) => {
  try {
    let chatId = req.params.id;
    let chat = await Chat.findById(chatId).populate("members", "username avatar");
    if (!chat) {
      throw new ApiError(400, "Not getting chat from given Id");
    }
    if (!chat.isGrouped && chat.creator.toString() !== req.user?._id) {
      throw new ApiError(400, "You cannot delete chat !");
    }
    if (!chat.isGrouped) {
      if (!chat.members.includes(req.user._id)) {
        throw new ApiError(400, "you are not is member")
      }
    }
    const messagesWithAttachments = await Message.find({
      chatId: chatId,
      attachment: { $exists: true, $ne: [] },
    });
    let public_id = messagesWithAttachments.map((mes) => mes.attachment.public_id);
    let messages = await Promise.all([
      Chat.findByIdAndDelete(chat._id),
      Message.deleteMany({ chatId: chat._id }),
      deleteCloudinary(public_id)
    ]);
    res.status(200).json(new Responce(messages, "Sucess", 200));

  } catch (error) {
    throw new ApiError(400, "Getting error in chat Details  :", error)
  }
})
export let getMessages = AsyncHandler(async (req, res, next) => {
  try {
    let chatId = req.params.id;
    let { limit = 20, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    let skip = (page - 1) * limit;
    let chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(400, "Not getting chat from given Id");
    };
    let message = await Message.aggregate([
      {
        $match: {
          chatId: chat._id
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "memberData",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          sender: { $arrayElemAt: ["$memberData", 0] }
        }
      }, {
        $project: {
          memberData: 0
        }
      },
      {
        $sort: {
          createdAt: 1
        }
      }
      // ,
      // {
      //   $skip: skip
      // },
      // {
      //   $limit: limit
      // }
    ]);
    if (!message) {
      throw new ApiError(400, "Not getting messages");
    }
    res.status(200).json({ message: message, page: page }, "Success", 200)

  } catch (error) {
    throw new ApiError(400, "not Getting messages  :", error)
  }
})
export let sendAttachments = AsyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const file = req.files || [];
    console.log(`THE REQ FILES HAS : ${JSON.stringify(req.files)}`);

    if (file.length == 0 || file.length > 5) {
      throw new ApiError(400, "The file length is up to requirment :", file.length);
    }
    console.log(`my file length ${file.length}`);

    let chat = await Chat.findById(chatId).populate("members", "username avatar");
    if (!chat) {
      throw new ApiError(400, "Not getting chat from given Id");
    }
    let me = await User.findById(req.user._id);
    if (!me) {
      throw new ApiError(400, "Not Authorized User Id");
    }
    const datafromCloudinary = await Promise.all(
      file.map(async (data) => {
        const attachment = await cloudinaryUploader(data.path);
        return attachment;
      })
    );
    let attachment = datafromCloudinary.map((data) => {
      return { public_id: data.public_id, url: data.url }
    })
    let mongodb = {
      content: "",
      attachment,
      sender: req.user?._id,
      chatId: req.body.chatId
    };
    let sendToFrontened = {
      content: "",
      attachment,
      sender: {
        name: me.username,
        avatar: me.avatar
      },
      chatId: {
        id: chat.id,
        members: chat.members
      }
    };

    let newMessage = await Message.create(mongodb);
    if (!newMessage) {
      throw new ApiError(400, "Not creating message for attachment");
    }

    res.status(200).json(new Responce(sendToFrontened, "Sucessfully", 200))

  } catch (error) {
    throw new ApiError(400, "Getting error in chat Details  :", error.message)
  }
})

export const createMessage = AsyncHandler(async (req, res) => {


  try {
    const { chatId } = req.body;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    console.log(" req user is", req.user);

    if (!req.files || req.files.length === 0) {
      throw new ApiError(401, "No files were uploaded.");
    }
    console.log(`my fi;e from multer ${req.files}`)

    let attachment = [];
    for (const file of req.files) {
      const result = await cloudinaryUploader(file.path);
      let att = {public_id:result.public_id , url:result.secure_url }
      attachment.push(att); // Assuming Cloudinary returns `secure_url`
    }
   

    const newMessage = await Message.create({
      content: "",
      attachment,
      sender: req.user._id,
      chatId
    });

    let newMessageForRealTime={
      attachment:attachment,
      chatId:chatId,
      content: "",
      sender: {
        _id:req.user._id ,
        username : req.user.username,
        avatar :req.user.avatar
      },
      createdAt:newMessage.createdAt,
      _id:newMessage._id
    }

    let chatData = await Chat.findById(chatId);
    let members = chatData.members;
    let Tosender = getValidSockets(members);
    console.log("To sender is :", Tosender);
     Tosender.map((send) => io.to(send).emit("NEW_MESSAGE", { newMessageForRealTime }));

     console.log("suceesfully created msg atttachment:",newMessageForRealTime )
    // Respond with the created message
    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: newMessage
    });
  } catch (error) {
    throw new ApiError(404, `Error is creating message with attachment ${error}`)
  }
});
export const getFriends = AsyncHandler(async (req, res, next) => {
  try {
    let user = req.user;
    console.log("Myself", user);

    if (!user) {
      throw new ApiError(404, "unAuthorized");
    }
    let getUser = await Chat.aggregate([
      {
        $match: {
          members: req.user._id
        }
      }
      ,
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "datamembers",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      }
      ,
      {
        $addFields: {
          members: "$datamembers"
        }
      }
      ,
      {
        $project: {
          members: 1
        }
      },
      {
        $unwind: "$members"
      },
      {
        $group: {
          _id: "$members._id",
          username: { $first: "$members.username" },
          avatar: { $first: "$members.avatar" }
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          avatar: 1
        }
      }
    ]);

    console.log(getUser);

    if (!getUser) {
      throw new ApiError(404, "not getting user my friends");
    }
    res.status(200).json(new Responce(200, "Sucessfully getting  User", getUser));
  } catch (error) {
    throw new ApiError(400, "Getting error in getting friends", error)
  }
});
export const chatFriend = AsyncHandler(async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    // Check if user is authenticated
    if (!req.user) {
      throw new ApiError(401, "Unauthorized access");
    }

    // Check if ID is provided in the parameters
    if (!id) {
      throw new ApiError(400, "ID parameter is missing");
    }

    // Find the friend using aggregation
    const friend = await Chat.aggregate([
      {
        $match: {
          isGrouped: false
        }
      },
      {
        $match: {
          members: { $all: [id, req.user._id] }
        }
      }
    ]);

    console.log("Found friends:", friend);

    // If no friend found, throw a 404 error
    if (friend.length < 1) {
      console.log(" No friend found ");
    }

    // Send successful response
    res.status(200).json(new Responce(200, "Successfully fetched friend", friend));
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching friend:", error);

    // Return a 500 error for any server-related issues
    next(new ApiError(500, "Error fetching friend data"));
  }
});


export const notMyFriend = AsyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    console.log(" req user is", req.user);


    // Step 1: Get the user's friends
    const getUser = await Chat.aggregate([
      { $match: { isGrouped: false, members: req.user._id } },
      { $unwind: "$members" },
      { $group: { _id: "$members" } },
    ]);
    getUser.push(req.user);
    const myFriends = getUser.map((user) => user._id.toString());

    // Step 2: Get users who are not friends
    const notMyFriend = await User.aggregate([
      { $match: { _id: { $nin: myFriends.map((id) => new mongoose.Types.ObjectId(id)) } } },
      { $project: { _id: 1, username: 1, avatar: 1 } },
    ]);
    // Respond with non-friends
    res.status(200).json(new Responce(200, notMyFriend, "Successfully retrieved non-friends."));
  } catch (error) {
    console.error("Error in notMyFriend:", error);
    throw new ApiError(500, "Error retrieving non-friends.");
  }
});


export let getmembersfromchatId = AsyncHandler(async (req, res, next) => {
  try {
    let chatId = new mongoose.Types.ObjectId(req.params.id);
    if (!chatId) {
      throw new ApiError(400, "not having id")
    }
    // Check if user is authenticated
    if (!req.user) {
      throw new ApiError(401, "Unauthorized access");
    }

    // Find the friend using aggregation
    const membersofchat = await Chat.aggregate([
      {
        $match: {
          _id: chatId
        }
      }
    ]);

    console.log("get members:", membersofchat);

    // // If no friend found, throw a 404 error
    // if (membersofchat.length < 1) {
    //   console.log(" No member found ");
    // }

    // Send successful response
    res.status(200).json(new Responce(200, "Successfully fetched friend", membersofchat));
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching member", error);

    // Return a 500 error for any server-related issues
    next(new ApiError(500, "Error fetching friend data"));
  }
});

export const newChat = AsyncHandler(async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError("members is required");
    }
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    let mem = await User.findById(req.params.id);
    let name = mem.username + req.user.username + " " + "Chats";
    let groupedCreation = await Chat.create({
      name,
      isGrouped: false,
      members: [req.params.id, req.user?._id],
      creator: req.user?._id
    });

    if (!groupedCreation) {
      throw new ApiError(400, "Does not create chat");
    }
    let members = [req.params.id, req.user._id];
    let Tosender = getValidSockets(members);
    console.log("To sender is :", Tosender);

    Tosender.map((send) => io.to(send).emit('REFETCH_CHATS', {}));

    return res.status(200).json(new Responce(groupedCreation, "Sucessfully created group", 200));
  } catch (error) {
    next(new ApiError(404, "error in creating : ", error.message))
  }
})