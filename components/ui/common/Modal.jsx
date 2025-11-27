import React, { useEffect, useRef } from "react";

const Modal = ({ children, isOpen, onClose}) => {

  const modalRef = useRef();

  useEffect(()=>{
    function clickOutside(e){
      console.log(e);
      
      if(modalRef.current && modalRef.current.contains()){
        onClose();
      }else console.log("okk");
      
    }
    window.addEventListener("click", clickOutside);
    return ()=>window.removeEventListener("click", clickOutside);
  },[]);

  return isOpen ? (
    <div className="fixed  z-50 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[340px] sm:w-[370px] md:w-[650px]  rounded-xl shadow-xl  relative">
        <div className="min-h-6/12 min-w-48">{children} </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Modal;
