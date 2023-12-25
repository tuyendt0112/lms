import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import banner4 from 'assets/banner4.jpg';
import emailjs from '@emailjs/browser';
import {
  Breadcrumb,
  Map,
} from "components";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const FAQ = () => {

  const [coords, setCoords] = useState(null);


  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_phheaon', 'template_clxxagd', form.current, '6UCB_Dfir_suWH3gL')
      .then((result) => {
        console.log(result.text);
        console.log("message sent")
        e.target.reset()
        Swal.fire('Congratulation', result.text, 'success')
      }, (error) => {
        console.log(error.text);
        Swal.fire('Oops!', error.text, 'error')
      });
  };

  const getCoords = async () => {
    const result = await geocodeByAddress('1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh');
    const latLng = await getLatLng(result[0]);

    setCoords(latLng);
  };
  getCoords();

  return (

    <div className=' w-full pb-2'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>Notification</h3>
          <Breadcrumb category='instruction' ></Breadcrumb>
        </div>
      </div>
      <div>
        <div className="w-main m-auto mt-8">
          <Map coords={coords} address={'Trường Đại Học Sư Phạm Kỹ Thuật TP.HCM'} />
        </div>
      </div>
      <div className='h-[81px] flex justify-center items-center bg-gray-100 mt-6'>

        <div className='w-main'>
          <h3 className='font-semibold'>If you have any questions, please contact us using the form below:</h3>
        </div>
      </div>
      <div className='flex flex-col items-center '>
        <h1 className='text-[25px] font-semibold text-main mb-6 mt-6'>Contact by email</h1>
        <form className='flex flex-col w-[500px] ' ref={form} onSubmit={sendEmail}>
          <label className='mt-2'>Name</label>
          <input className='rounded' type="text" name="user_name" />
          <label className='mt-2'>Email</label>
          <input className='rounded' type="email" name="user_email" />
          <label className='mt-2'>Message</label>
          <textarea className='rounded' name="message" />
          <input className='bg-blue-500 mt-2 cursor-pointer text-white h-[40px]' background type="submit" value="Send" />
        </form>
      </div>

    </div>
  )
}

export default FAQ