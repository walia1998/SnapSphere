import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSelector ,useDispatch } from "react-redux";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store => store.auth)
  const {post} = useSelector(store => store.post)


  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataurl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
        setLoading(true)
      const res = await axios.post("http://localhost:8000/api/v2/post/addpost",formData, {
        headers: {
            'Content-Type' : 'multipart/form-dat'
          },withCredentials: true
      });
      if(res.data.success) {
        dispatch(setPosts([res.data.post, ...posts ]));
        toast.success(res.data.message);
        setOpen(false);
      }
      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent inInteractOutside={() => setOpen(false)}>
        <DialogHeader className="font-semibold text-center">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.prfilePicture} alt="Image" />
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <sapn className="text-gray-600 text-xs">Bio</sapn>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />

        {imagePreview && (
          <div className=" w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="imagePreview"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </button>
      </DialogContent>

      {imagePreview &&
        (loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </Button>
        ) : (
          <Button
            onClick={createPostHandler}
            type="submit"
            className="w-full"
          ></Button>
        ))}
      <Button>Post</Button>
    </Dialog>
  );
};

export default CreatePost;
