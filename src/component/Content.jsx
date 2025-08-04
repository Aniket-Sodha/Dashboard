

  let Content = () => {

    return (

      <div className="flex flex-col lg:flex-row justify-evenly  items-center px-1 w-full mt-8 font-family">
        <div className="w-full lg:w-[30%] py-4 px-3 space-y-5 shadow-md rounded-2xl shadow-slate-400 ">
          <p className=" text-[12px] px-5 py-2 font-medium"> Toatal Revenue</p>
          <p className="text-3xl px-5  font-bold">102589</p> 
        </div>
        <div className="w-full lg:w-[30%]  space-y-5 py-4 px-3   shadow-md rounded-2xl shadow-slate-400">
          <p className="text-[12px] px-5 py-2 font-medium"> Toatal Orders</p>
          <p className="text-3xl px-5 font-bold">207</p>
        </div>
        <div className="w-full lg:w-[30%]  space-y-5 py-4 px-3 shadow-md rounded-2xl shadow-slate-400 ">
          <p className="text-[12px] px-5 py-2 font-medium"> Toatal Quantity</p>
          <p className="text-3xl px-5 font-bold">186</p>
        </div>
      </div>
    );
  };
  export default Content;
