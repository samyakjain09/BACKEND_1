const followModel=require("../models/follow.model")
const userModel = require("../models/user.model")

async function followUserController(req,res){
    const id=req.user.id
    const followerUsername=req.user.username
    const followeeUsername=req.params.username


    if(followerUsername===followeeUsername){
        return res.status(400).json({
            message:"you cannot follow yourself"
        })
    }

    const isFolloweeExist=await userModel.findOne({
        username:followeeUsername
    })


    if(!isFolloweeExist){
        return res.status(404).json({
            message:"user you are trying to follow does not exists"
        })
    }

    const isAlreadyFollowing=await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message:`you are already following ${followeeUsername}`,
            follow:isAlreadyFollowing
        })
    }

    res.status(201).json({
        message:`you are following ${followeeUsername}`,
        follow:followRecord
    })
}

async function unfollowController(req,res){
    const followerUsername=req.user.username
    const followeeUsername=req.params.username

    const isUserFollowing =await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if(!isUserFollowing){
        return res.status(200).json({
            message:`you are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message:`you have unfollowed ${followeeUsername}`
    })

}

module.exports={followUserController,unfollowController}