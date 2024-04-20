import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const Home = () => {

const [visible, setVisible] = useState(false)
const [toggleprice,setTogglePrice] =useState(false);


const handlePrice = ()=>{
  setTogglePrice(!toggleprice)
}
  return (
    <div className='w-full min-h-[600px]  bg-green-600  pt-32'>
      <section className="w-3/4 bg-white mx-auto text-3xl font-bold text-center">
       {
        toggleprice ?  <h1 className="">

        Premium Hero Slider: 27.00 USD
      </h1> : null
       }
        <button className="text-black" onClick={handlePrice}>Price</button>

        <div className="relative mt-16 bg-gray-500  max-w-md mx-auto">

          <input className="text-black bg-yellow-300 w-full block"

            type={visible ? "text" : "password"}

          />
          {visible ? (
            <AiOutlineEye
              className="absolute right-2 top-2 cursor-pointer"
              size={25}
              onClick={() => setVisible(false)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="absolute right-2 top-2 cursor-pointer"
              size={25}
              onClick={() => setVisible(true)}
            />
          )}
        </div>
      </section>





    </div>
  )
}

export default Home