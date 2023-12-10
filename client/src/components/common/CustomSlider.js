import React, { memo } from 'react'
import Pitch from 'components/products/Pitch';
import Slider from "react-slick";

const settings = {
    dots: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 2
};
const CustomSlider = ({ pitches, activedTab, normal }) => {
    return (
        <>
            {pitches && <Slider className='custom-slider' {...settings}>
                {pitches?.map((el, index) => (
                    <>
                        <Pitch
                            key={index}
                            pid={el.id}
                            pitchData={el}
                            isNew={activedTab === 1 ? false : true}
                            normal={normal}
                        >
                        </Pitch>
                    </>
                ))}
            </Slider>}
        </>
    )
}

export default memo(CustomSlider)