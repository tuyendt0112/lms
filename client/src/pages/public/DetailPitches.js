import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetTopic, apiGetPitches, apiBooking } from "apis";
import {
  Breadcrumb,
  Button,
  PitchExtraInfo,
  PitchInformation,
  CustomSlider,
  Map,
} from "components";
import Slider from "react-slick";

import { formatMoney, formatPrice, renderStarFromNumber } from "ultils/helper";
import { pitchExtraInformation } from "ultils/constant";
import DOMPurify from "dompurify";
import clsx from "clsx";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { shifts } from "ultils/constant";
import icons from "ultils/icons";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import path from "ultils/path";
import { toast } from "react-toastify";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import moment from "moment";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const { FaCalendarAlt } = icons;
const DetailPitches = ({ isQuickView, data }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [pid, setpitchid] = useState(null);
  const [category, setpitchcategory] = useState(null);
  const { isLoggedIn, current } = useSelector((state) => state.user);
  const [pitch, setpitch] = useState(null);
  const [selectedShift, setSelectedShift] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentImage, setcurrentImage] = useState(null);
  const [relatedPitches, setrelatedPitches] = useState(null);
  const [update, setUpdate] = useState(false);
  const { title, brand } = useParams();
  const [selectedHour, setSelectedHour] = useState([]);
  const [coords, setCoords] = useState(null);

  const handleClickBooking = async () => {
    console.log("Selected Shift:", selectedShift);
    console.log("Selected Date:", new Date(selectedDate));
    console.log("Selected hour:", selectedHour);
    if (!isLoggedIn) {
      return Swal.fire({
        title: "Almost...",
        text: "Please Login !!!",
        icon: "info",
        cancelButtonText: "Not Now",
        showCancelButton: true,
        confirmButtonText: "Go Login Page",
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`${path.LOGIN}`);
      });
    }

    const response = await apiBooking({
      shifts: selectedShift,
      bookedDate: selectedDate,
      pitchId: pid,
      hours: selectedHour,
      total: pitch?.price,
      namePitch: pitch?.title,
    });
    if (response.success) {
      toast.success(response.message);
    } else toast.error(response.message);
  };

  const fetchPitchData = async () => {
    const response = await apiGetTopic(pid);
    console.log(response)
    if (response.success) {
      setpitch(response.pitchData);
    }
  };

  const fetchPitches = async () => {
    const response = await apiGetPitches({ brand });
    if (response.success) setrelatedPitches(response.pitches);
  };

  useEffect(() => {
    if (pid) {
      fetchPitchData();
      fetchPitches();
    }
    window.scrollTo(0, 0);
  }, [pid]);

  useEffect(() => {
    if (pid) {
      fetchPitchData();
    }
  }, [update]);

  useEffect(() => {
    if (data) {
      setpitchid(data.pid);
      setpitchcategory(data.category);
    } else if (params && params.pid) {
      setpitchid(params.pid);
      setpitchcategory(params.category);
    }
  }, [data, params]);

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleClickimage = (e, el) => {
    e.stopPropagation();
    setcurrentImage(el);
  };

  return (
    <div className={clsx("w-full")}>
      {!isQuickView && (
        <div className="h-[81px] flex justify-center items-center bg-gray-100">
          <div className="w-main">
            <h3 className="font-semibold">{title}</h3>
            <Breadcrumb
              title={title}
              category={category}
              brand={brand}
            ></Breadcrumb>
          </div>
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "bg-white m-auto mt-4 flex",
          isQuickView ? "max-w-[1200px] gap-16 p-8" : "w-main"
        )}
      >
        <div
          className={clsx("flex flex-col gap-3 w-2/5 ", isQuickView && "w-1/2")}
        >
          <h2 className="text-[30px] font-semibold">{pitch?.title}</h2>

          <h2 className="font-semibold pt-2">Major:</h2>
          <span>{pitch?.major} </span>
          <h2 className="font-semibold pt-2">Department:</h2>
          <span>{pitch?.department}</span>
          <h2 className="font-semibold pt-2">Instructor:</h2>
          <span>{pitch?.instructors?.firstname} {pitch?.instructors?.lastname}</span>
          <span className="line-clamp-1">
            <label className='font-bold'>Date Start: </label>
            {moment(pitch?.DateStart).format("DD/MM/YYYY")}
            <label className='font-bold ml-2'>Date End: </label>
            {moment(pitch?.DateEnd).format("DD/MM/YYYY")}
          </span>
          <h2 className="font-semibold pt-2  ">Description:</h2>
          {/* <ul className='list-item'>
  <div className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pitch?.description) }}></div>
</ul> */}
          <ul className="list-square text-sm text-gray-500">
            {pitch?.description?.length > 1 &&
              pitch?.description?.map((el) => (
                <li className="leading-6" key={el}>
                  {el}
                </li>
              ))}
            {pitch?.description?.length === 1 && (
              <div
                className="text-sm line-clamp-[15] "
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(pitch?.description[0]),
                }}
              ></div>
            )}
          </ul>

          <div className="w-[458px] ml-2">
            <div>
              <Button fw handleOnClick={handleClickBooking}>
                Register
              </Button>
            </div>
          </div>
        </div>
        <div className="w-2/5 pr-[24px] gap-4">
        </div>
        {!isQuickView && (
          <div className="w-1/5">
            {pitchExtraInformation.map((el) => (
              <PitchExtraInfo
                key={el.id}
                title={el.title}
                icon={el.icon}
                sub={el.sub}
              />
            ))}
          </div>
        )}
      </div>

      {!isQuickView && (
        <>
          <div className="w-main m-auto mt-8">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-blue-500">
            </h3>
            <CustomSlider pitches={relatedPitches} normal={true} />
          </div>
          <div className="h-[100px] w-full"></div>
        </>
      )}
    </div>
  );
};

export default DetailPitches;
