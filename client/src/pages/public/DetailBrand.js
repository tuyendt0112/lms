import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetBrandByTitle, apiGetPitches, apiGetBrand } from "apis";
import { pitchInforTabs } from 'ultils/constant'
import {
    Breadcrumb,
    Button,
    PitchExtraInfo,
    PitchInformation,
    CustomSlider,
    Map,
    BrandRating,
} from "components";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import { formatMoney, formatPrice, renderStarFromNumber } from "ultils/helper";
import { pitchExtraInformation } from "ultils/constant";
import DOMPurify, { clearConfig } from "dompurify";
import clsx from "clsx";
import Select from "react-select";
import icons from "ultils/icons";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import path from "ultils/path";
import { toast } from "react-toastify";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};


const DetailBrand = () => {
    const { category, brand } = useParams();
    const [activedTab, setActivedTab] = useState(1)

    const [showBrand, setShowBrand] = useState(null);
    const [relatedPitches, setrelatedPitches] = useState(null);
    const [update, setUpdate] = useState(false);
    console.log(brand);
    const fetchBrand = async (b) => {
        const response = await apiGetBrandByTitle(b);
        if (response.success) setShowBrand(response.BrandData);
    };
    const fetchPitches = async () => {
        const response = await apiGetPitches({ brand });
        if (response.success) setrelatedPitches(response.pitches);
    };
    const rerender = useCallback(() => {
        setUpdate(!update);
    }, [update]);
    useEffect(() => {
        if (brand) {
            fetchBrand(brand);
        }
    }, [update]);
    useEffect(() => {
        fetchBrand(brand);
        fetchPitches(brand);
    }, [brand]);
    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold">{brand}</h3>
                    <Breadcrumb category={category} brand={brand}></Breadcrumb>
                </div>
            </div>

            <div className="flex w-full justify-center items-center py-4">
                <div className="w-[1200px]">
                    <Slider className="image-slider" {...settings}>
                        {showBrand?.images?.map((el) => (
                            <div className="flex w-full gap-2" key={el}>
                                <img
                                    // onClick={(e) => handleClickimage(e, el)}
                                    src={el}
                                    alt="sub-pitch"
                                    className="h-[500px] w-[1200px] cursor-pointer border object-cover"
                                ></img>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            <div className="flex flex-col w-main justify-center items-center">
                <div className="text-[25px] text-main font-semibold">
                    {showBrand?.title}
                </div>

                <div className="flex items-center justify-center">
                    <span className="mr-3">Rating:</span>
                    {renderStarFromNumber(showBrand?.totalRatings, 24)?.map(
                        (el, index) => (
                            <span key={index}>{el}</span>
                        )
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 relative bottom-[-1px]">
                {pitchInforTabs.map((el) => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === +el.id
                            ? "bg-red-500 border border-b-0"
                            : "bg-gray-200"
                            } `}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="w-full border p-4">
                {activedTab === 1 &&
                    <div className="w-full">
                        <h2 className="font-semibold pt-2">Address:</h2>
                        {showBrand?.address}
                        <h2 className="font-semibold pt-2  ">Description:</h2>
                        <ul className="list-square text-sm text-gray-500">
                            {showBrand?.description?.length > 1 &&
                                showBrand?.description?.map((el) => (
                                    <li className="leading-6" key={el}>
                                        {el}
                                    </li>
                                ))}
                            {showBrand?.description?.length === 1 && (
                                <div
                                    className="text-sm line-clamp-[15] "
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(showBrand?.description[0]),
                                    }}
                                ></div>
                            )}
                        </ul>

                    </div>
                }
                {activedTab === 2 &&
                    <div className="flexw w-full justify-center items-center">
                        <div>
                            <h2 className="font-semibold pt-2">Thông Tin Chủ Sân:</h2>
                            <h2 className="font-semibold pt-2">Tên:</h2>
                            {`${showBrand?.owner?.firstname} ${showBrand?.owner?.lastname}`}

                            <h2 className="font-semibold pt-2">Email:</h2>
                            {showBrand?.owner?.email}
                        </div>
                    </div>
                }
                {activedTab === 3 &&
                    <div className="flex items-center justify-center py-2">
                        <h2 className="font-semibold ">Category:</h2>
                        {showBrand?.categories?.map((el) => (
                            <span className="ml-2">{el}</span>
                        ))}
                    </div>
                }
            </div>
            <div>
                <div className="w-main m-auto mt-8">
                    <BrandRating
                        totalRatings={showBrand?.totalRatings}
                        ratings={showBrand?.ratings}
                        nameBrand={showBrand?.title}
                        bid={showBrand?._id}
                        rerender={rerender}
                    />
                </div>
            </div>
            <div>
                <h3 className="text-[25px] text-main font-semibold py-[15px] border-b-2 border-main text-center">
                    HOT PITCH
                </h3>
                <CustomSlider pitches={relatedPitches} normal={true} />
            </div>
        </div>
    );
};

export default DetailBrand;
