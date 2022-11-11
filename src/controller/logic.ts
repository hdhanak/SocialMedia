import express, { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
import { isImportEqualsDeclaration } from "typescript";
const multer = require("multer");
import {
  ErrorMessage,
  MessageResponse,
  tokenAccess,
} from "../middleware/commenResError";
import commentOnPost from "../models/comment";
import postModel from "../models/CraetePosts";
import invitationModel from "../models/invitation";
import likePostModel from "../models/like";
import signUp from "../models/register";
import tokenModel from "../models/token";

import { fileFilter, storage } from "../router/routers";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Appstring = require("../Appstring");
require("dotenv").config();
var mongoose = require("mongoose");

const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      PhoneNo: req.body?.PhoneNo,
    });
    await user.save();
    MessageResponse(req, res, user, 201);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await signUp.findOne({
      email: req.body?.email,
      PhoneNo: req.body?.PhoneNo,
    });

    const userLogin = await tokenModel.findOne({ userId: user?._id });

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        if (userLogin) {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          await tokenModel.updateOne(
            { userId: user._id },
            { token: token },
            {
              new: true,
            }
          );
          tokenAccess(req, res, token, 200);
        } else {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          const createToken = await tokenModel.create({
            userId: user._id,
            token: token,
          });
          await createToken.save();

          tokenAccess(req, res, createToken, 200);
        }
      } else {
        ErrorMessage(req, res, Appstring.NOT_VALID_DETAILS, 400);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};

const CreatePost = async (req: Request, res: Response) => {
  try {
    console.log(req.userId, "req.userId");

    const post = await postModel.create({
      userId: req.userId,
      description: req.body.description,
      image: req.body.image,
      visibilty: req.body.visibilty,
    });
    await post.save();
    MessageResponse(req, res, post, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const imgUpload = async (req: Request, res: Response, next: NextFunction) => {
  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: maxSize },
  }).array("img");

  upload(req, res, async (err: any) => {
    if (err) {
      console.log(err, "errorr");
      ErrorMessage(req, res, err, 400);
    } else {
      console.log(req.files);
      var e: any = {};
      let a: any = req.files;
      a?.map((d: any, index: any) => {
        console.log(d, "d");
        e[index] = d.filename;
      });
      MessageResponse(req, res, e, 200);
    }
  });
};

const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const LikeExsit = await likePostModel.findOne({
      userId: req.userId,
      postId: req.body.postId,
    });
    if (!LikeExsit) {
      const like = await likePostModel.create({
        userId: req.userId,
        postId: req.body.postId,
      });
      await like.save();
      MessageResponse(req, res, like, 200);
    } else {
      const unLike = await likePostModel.deleteOne({
        userId: req.userId,
        postId: req.body.postId,
      });

      MessageResponse(req, res, "exsit and deleetd like", 200);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const unLikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unLike = await likePostModel.deleteOne({
      userId: req.userId,
      postId: req.body.postId,
    });

    MessageResponse(req, res, unLike, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const commentPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await commentOnPost.create({
      userId: req.userId,
      postId: req.body.postId,
      refId: req.body.refId ? req.body.refId : undefined
    });
    await comment.save();
    MessageResponse(req, res, comment, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const postList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await postModel.aggregate([
      {
        $lookup: {
          from: "register",
          localField: "userId",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      {
        $unwind: {
          path: "$userDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          let: { parentUserId: "$userId" },
          pipeline: [
            {
              $group: {
                _id: "postId",
                totalLike: { $sum: 1 },
                isLike: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$$parentUserId", "$userId"] },
                      then: 1,
                      else: 0,
                    },
                  },
                },


              },
            },


          ],
          as: "data",
        },
      },

      {
        $unwind: {
          path: "$data",

          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "data2",
          pipeline: [{ $count: "postId" }],
        },
      },
      {
        $unwind: {
          path: "$data2",

          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          userName: "$userDetail.firstName",
          description: "$description",
          image: "$image",
          userId: "$userId",
          // dataU: "$data",
          totalLike: {
            $cond: {
              if: { $ne: [{ $type: "$data.totalLike" }, "missing"] },
              then: "$data.totalLike",
              else: 0,
            },
          },
          totalComment: {
            $cond: {
              if: { $ne: [{ $type: "$data2.postId" }, "missing"] },
              then: "$data2.postId",
              else: 0,
            },
          }, // "$data2.postId"
          isLike: {
            $cond: {
              if: { $ne: [{ $type: "$data.isLike" }, "missing"] },
              then: "$data.isLike",
              else: 0,
            },
          },
          // {
          //   $cond: {
          //     if: { $eq: ["$data.userId", "$userId"] },
          //     then: 1,
          //     else: 0
          //   },
          // },
          // totalLike: "$data._id",
          // totalComment: "$data._id"
        },
      },
    ]);
    // var arr :any= []
    // const user =await postModel.find().lean()
    //  await Promise.all(user.map(async(d:any,index:any)=>{

    //   const like = await likePostModel.find({postId:d._id}).count()
    //   const comment = await commentOnPost.find({postId:d._id}).count()
    //   // console.log(d);

    //   d.totalLike = like
    //   d.totalComment = comment
    //   // console.log('2');

    //   console.log(d,'kk');
    //   // console.log('3');

    //     arr.push(d)
    // }))
    // console.log(arr,'arr');

    MessageResponse(req, res, user, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
// const postList = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await postModel.aggregate([
//       {
//         $lookup: {
//           from: "register",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userDetail",
//         },
//       },
//       {
//         $unwind: {
//           path: "$userDetail",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "likes",
//           localField: "_id",
//           foreignField: "postId",
//           let: { parentUserId: "$userId" },
//           pipeline: [
//             // {
//             //   $count: "postId",

//             // },
//             {
//               $group: {
//                 _id: "postId",
//                 totalLike: { $sum: 1 },
//                 isLike: {
//                   $sum: {
//                     $cond: {
//                       if: { $eq: ["$$parentUserId", "$userId"] },
//                       then: 1,
//                       else: 0,
//                     },
//                   },
//                 },

//                 // de: { $first: "$$ROOT" },
//               },
//             },

//             // {
//             //   $replaceRoot: {
//             //     newRoot: {
//             //       $mergeObjects: [{ totalLike: "$totalLike"},{isLike:"$isLike"}, "$de"],
//             //     },
//             //   },
//             // },
//           ],
//           as: "data",
//         },
//       },
//       //   {
//       //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$data",  1] }, "$$ROOT" ] } }
//       //  },
//       // {
//       //   $unwind: "$data",
//       // },

//       {
//         $unwind: {
//           path: "$data",

//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       {
//         $lookup: {
//           from: "comments",
//           localField: "_id",
//           foreignField: "postId",
//           as: "data2",
//           pipeline: [{ $count: "postId" }],
//         },
//       },
//       {
//         $unwind: {
//           path: "$data2",

//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       // { $unwind: "$data2" },

//       //   {
//       //     $group: {
//       //       _id:"$data2_postId",
//       //       totalComment: { $sum: 1 },
//       //       "de":{"$first":"$$ROOT"}
//       //     }
//       // },
//       //   {
//       //     $replaceRoot: {
//       //         newRoot: { $mergeObjects: [{ totalComment: '$totalComment' },{totalLike: '$totalLike'}, '$de'] },
//       //       },
//       //   },

//       {
//         $project: {
//           _id: 1,
//           userName: "$userDetail.firstName",
//           description: "$description",
//           image: "$image",
//           userId: "$userId",
//           // dataU: "$data",
//           totalLike: {
//             $cond: {
//               if: { $ne: [{ $type: "$data.totalLike" }, "missing"] },
//               then: "$data.totalLike",
//               else: 0,
//             },
//           },
//           totalComment: {
//             $cond: {
//               if: { $ne: [{ $type: "$data2.postId" }, "missing"] },
//               then: "$data2.postId",
//               else: 0,
//             },
//           }, // "$data2.postId"
//           isLike: {
//             $cond: {
//               if: { $ne: [{ $type: "$data.isLike" }, "missing"] },
//               then: "$data.isLike",
//               else: 0,
//             },
//           },
//           // {
//           //   $cond: {
//           //     if: { $eq: ["$data.userId", "$userId"] },
//           //     then: 1,
//           //     else: 0
//           //   },
//           // },
//           // totalLike: "$data._id",
//           // totalComment: "$data._id"
//         },
//       },
//     ]);
//     // var arr :any= []
//     // const user =await postModel.find().lean()
//     //  await Promise.all(user.map(async(d:any,index:any)=>{

//     //   const like = await likePostModel.find({postId:d._id}).count()
//     //   const comment = await commentOnPost.find({postId:d._id}).count()
//     //   // console.log(d);

//     //   d.totalLike = like
//     //   d.totalComment = comment
//     //   // console.log('2');

//     //   console.log(d,'kk');
//     //   // console.log('3');

//     //     arr.push(d)
//     // }))
//     // console.log(arr,'arr');

//     MessageResponse(req, res, user, 200);
//   } catch (error) {
//     ErrorMessage(req, res, error, 400);
//   }
// };

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isPost = await postModel.findOne({ _id: req.body.postId });
    if (isPost) {
      if (JSON.stringify(req.userId) === JSON.stringify(isPost?.userId)) {
        const like = await likePostModel.deleteMany({
          postId: req.body.postId,
        });
        const comment = await commentOnPost.deleteMany({
          postId: req.body.postId,
        });
        MessageResponse(req, res, "post deleted", 200);
      } else {
        ErrorMessage(req, res, "This post deleted by only post-creator", 400);
      }
    } else {
      ErrorMessage(req, res, "user not found", 400);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};

const sendInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postModel.findOne({ _id: req.body.postId });
    if (post?.visibilty == true) {
      const invitation = await invitationModel.create({
        userId: req.userId,
        postId: req.body.postId,
        inviteeId: req.body.inviteeId,
      });
      await invitation.save();
      MessageResponse(req, res, invitation, 200);
    } else {
      ErrorMessage(req, res, "this post is not private", 400);
    }
  } catch (error) {
    console.log(error);
    ErrorMessage(req, res, error, 400);
  }
};
const getInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.userId, 'k');

    const invitations = await invitationModel.aggregate([

      { $match: { inviteeId: mongoose.Types.ObjectId(req.userId) } },


    ]);
    MessageResponse(req, res, invitations, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const changeInvitedStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.params.postId);
    const post = await postModel.findOne({ _id: req.params.postId })
    console.log(post?.userId);
    if (post) {
      const user = await invitationModel.updateOne(
        {
          userId: post.userId,
          postId: req.params.postId,
          inviteeId: req.userId
        },
        // {status:req.body.status}
        { $set: { status: req.body.status } },
        { new: true }
      );
      MessageResponse(req, res, `status ${req.body.status}`, 200);
    } else {
      ErrorMessage(req, res, 'post deleted', 400);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};


const getCommnetsForId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.postId
    console.log(id);

    // const comment = await commentOnPost.aggregate([
    //   { $match: { postId: mongoose.Types.ObjectId(id), userId: mongoose.Types.ObjectId(req.userId) } },
    //   {
    //     $lookup: {
    //       from: "register",
    //       localField: "userId",
    //       foreignField: "_id",
    //       pipeline: [
    //         {
    //           $project: {
    //             _id: 0,
    //             firstName: "$firstName"
    //           }
    //         }
    //       ],
    //       as: "userDetail",
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$userDetail",
    //       preserveNullAndEmptyArrays: false,
    //     },
    //   },
    //   // {
    //   //   $addFields: {
    //   //     firstName: "$userDetail.firstName"
    //   //   }
    //   // },



    //   {
    //     $graphLookup: {
    //       from: "comments",
    //       startWith: "$_id",
    //       connectFromField: "_id",
    //       connectToField: "refId",
    //       as: "reply"
    //     }
    //   },
    //   // { $addFields:
    //   //   {
    //   //      "tempsF":
    //   //         { $map:
    //   //            {
    //   //               input: "$reply",
    //   //               as: "d",
    //   //               in: { $add: [ 5, 32 ] }
    //   //            }
    //   //         }
    //   //    }
    //   // },

    //   {
    //     $project: {
    //       _id: 1,
    //       postId: "$postId",
    //       userName: "$userDetail.firstName",
    //       reply: "$reply",
    //       tempsF: "$tempsF"

    //     }
    //   },

    // ])
    const comment = await postModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id), userId: mongoose.Types.ObjectId(req.userId) } },
      {
        $lookup: {
          from: "register",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                firstName: "$firstName"
              }
            }
          ],
          as: "userDetail",
        }
      },
      {
        $unwind: {
          path: "$userDetail",
          // preserveNullAndEmptyArrays: true,
        },
      },
      
     {
      $lookup:{
        from: "comments",
          localField: "_id",
          foreignField: "postId",
          pipeline: [
            {
              $graphLookup: {
                from: "comments",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "refId",
                as: "reply"
              }
            },
          ],
          as: "userDetail1",
     
      }
     }
      // { $addFields:
      //   {
      //      "tempsF":
      //         { $map:
      //            {
      //               input: "$reply",
      //               as: "d",
      //               in: { $add: [ 5, 32 ] }
      //            }
      //         }
      //    }
      // },
,
      {
        $project: {
          _id: 1,
          postId: "$postId",
          userName: "$userDetail.firstName",
          reply: "$reply",
          userDetail1: "$userDetail1"

        }
      },

    ])
    MessageResponse(req, res, comment, 200)

  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
}
export {
  register,
  deletePost,
  login,
  CreatePost,
  imgUpload,
  likePost,
  commentPost,
  postList,
  unLikePost,
  sendInvitation,
  getInvitation,
  changeInvitedStatus,
  getCommnetsForId
};
// _id
// 6347f3b1e4798f16fb5b594f
// userId
// 6347d7135717c48c6c38acad
// postId
// 6347f381e4798f16fb5b594c
