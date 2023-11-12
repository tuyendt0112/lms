import React, { memo } from 'react'
import { Pitch } from './'
import Slider from "react-slick";

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};
const CustomSlider = ({ pitches, activedTab }) => {
    return (
        <div>
            <Slider {...settings}>
                {pitches?.map((el, index) => (
                    <Pitch
                        key={index}
                        pid={el.id}
                        pitchData={el}
                        isNew={activedTab === 1 ? false : true}
                    >
                    </Pitch>
                ))}
            </Slider>
        </div>
    )
}

export default memo(CustomSlider)