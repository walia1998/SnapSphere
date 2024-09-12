import { User } from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../Models/postModel.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; //object destructer

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message:
          "You've already registered, Please try with differnet email id ",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
          message:
            "inccorect email or password",
          success: false,
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message:
            "inccorect email or password",
          success: false,
        });
      };
      const token = await jwt.sign({userId: user._id},process.env.SECRET_KEY, {expiresIn:'1d'});
 
      //populate each post id in the posts array
 
      const populatedPosts = await Promise.all(
        user.posts.map(async (postId) => {
          const post =  await Post.findById(postId);
          
          if(post.author.equals(user._id)) {
            return post;
          }
           return null
        })
      ) 

       user = {
        _id:user._id,
        username : user.username,
        email: user.email,
        bio:user.bio,
        profilePicture : user.profilePicture,
        follower : user.follower,
        following: user.following,
        posts: populatedPosts
       }

      return res.cookie('token', token, {httpOnly:true, someSite:'strict', maxAge:1*24*60*60*1000}).json({
        message : `Welcome back ${user.username}`,
        success:true,
        user
      });
  } catch (error) {
    console.log(error)
  }
};


export const logout = async (_,res) => {
    try {
        return res.cookie("token", "", {maxAge: 0}).json({
            message: "Looged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const getProfile = async(req,res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate(bookmarks);
        return res.status(200).json({
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;



        if(profilePicture) {
           const fileUri  = getDataUri(profilePicture);
          cloudResponse =  await cloudinary.uploader.upload(fileUri);
        }

       const user = await User.findById(userId).select('-password');
       if(!user) {
        return res.status(404).json({
            message: 'User not found',
            success:false
        })
       }
       if(bio) user.bio = bio;
       if(gender) user.gender = gender;
       if(profilePicture) user.profilePicture = cloudResponse.secure_url;

       await user.save();
       return res.status(200).json({
        message: 'Profile updated',
        success:true,
        user
       });

    } catch (error) {
        console.log(error)
    }
};

export const getSuggestedUsers = async (req,res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.findById}}).select("-password");

     if(!suggestedUsers) {
        return res.status(400).json({
            message: 'Currently do not have any users'
        })
     };
     return res.status(200).json({
       success:true,
       Users:suggestedUsers
    })

    } catch (error) {
        console.log(error)
    }
};

export const followOrUnfollow = async (req,res) => {
    try {
        const meFollow = req.id;
        const isFollow = req.params.id;
        if(meFollow ===isFollow) {
            return res.status(400).json({
                message:"You can not follow/unfollow yourself",
                success:false
            })
        }
           
        const user = await User.findById(meFollow);
        const targetUser = await User.findById(isFollow);

        if(!user || !targetUser) {
            return res.status(400).json({
                message:"User not found",
                success:false
            });
        }
//now i'll chekc that i follow or unfollow this guy

const isFollowing  = user.following.includes(isFollow);
if(isFollowing) {
    //already following logic -> unfollow
    await Promise.all([
        User.updateOne({_id:meFollow}, {$pull:{following:isFollow}}),
        User.updateOne({_id:isFollow}, {$pull:{follower:meFollow}}),
    ])
    return res.status(200).json({message:'Unfollowed successfully', success:true})
}else {
    //follow logic

    await Promise.all([
        User.updateOne({_id:meFollow}, {$push:{following:isFollow}}),
        User.updateOne({_id:isFollow}, {$push:{follower:meFollow}}),
    ])
    return res.status(200).json({message:'followed successfully', success:true})
}
    } catch (error) {
        console.log(error);
    }
}