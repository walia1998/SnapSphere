import { useDispatch } from "react-redux"

const { setPosts } = require("@/redux/postSlice")
const { default: axios } = require("axios")
const { useEffect } = require("react")


const useGetAllPost = () => {

    const dispatch = useDispatch();
    useEffect (() => {
        const fetchAllPost = async () => {
            try {
                const res  = await axios.get('http:localhost:8000/api/v2/post/all', {withCredentials:true});
                  if(res.data.success) {
                   // console.log(res.data);
                    dispatch(setPosts(res.data.posts))
                  }

            } catch (error) {
               console.log(error)
            }
        }
        fetchAllPost();
    }, []);
}
export default useGetAllPost;