import { useGetLoggedUserQuery } from "../../services/userAuthAPI";
import { useEffect, useState } from "react";
import { setUserInfo } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const style_TabPanel = {
  mt: {
    xs: 1,    // margin-top for extra-small screens
    sm: 2,    // small screens
    md: 3,    // medium screens
    lg: 4,    // large screens
  },
  p: 0,
};

const Home =()=> {
  const access_token = useSelector((state) => state.auth.access_token);
  const { data, isSuccess } = useGetLoggedUserQuery(access_token, { skip: !access_token});
  console.log(data)
  const [userData, setUserData] = useState(
    { email: '',
      First_name: ''
    }
  )
  // store user data in Local State
  useEffect(()=>{
    if (data && isSuccess){
      setUserData({
        email : data.email,
        First_name : data.First_name
      })
    }
  },[data, isSuccess]
  )
  const dispatch = useDispatch()
  useEffect(()=>{
    if (data && isSuccess){
      dispatch( setUserInfo ({
        email : data.email,
        First_name : data.First_name
      }))
    }
  }, [data, isSuccess, dispatch])

  return (
    <>
    <h1>Hi{access_token ? `, ${userData.First_name}` : ''}</h1>
  <h1>you are on BlogPage <hr/></h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus quibusdam provident facilis magnam aut natus dolorem accusantium voluptas nulla vel temporibus sunt ea, consequuntur fugiat officiis nam beatae! Voluptate, aliquam nisi esse ut incidunt perspiciatis ex magnam nesciunt? Eveniet sequi adipisci ex commodi doloribus est esse quas vero veniam? Eos eius dolorem architecto repellendus recusandae aliquid quasi perferendis consectetur. Tempore ipsam, a voluptatem nemo voluptas ratione velit provident blanditiis ut molestias voluptatibus, odio officiis quis itaque deserunt nulla adipisci perspiciatis, aliquam laudantium inventore veniam nostrum! Beatae, mollitia ex quos necessitatibus vitae quo natus. Porro omnis doloremque nesciunt fuga quae excepturi.</p>
    </>
  )
}

export default Home