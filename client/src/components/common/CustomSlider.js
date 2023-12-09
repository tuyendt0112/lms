import React, { memo } from 'react'
import Pitch from 'components/products/Pitch';
import Slider from "react-slick";

const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 2
};
const CustomSlider = ({ pitches, activedTab, normal }) => {
    {
        pitches?.map((el, index) => (console.log(el)
        ))
    }
    return (
        <>
            {pitches && <Slider className='custom-slider' {...settings}>
                {pitches?.map((el, index) => (
                    <>
                        <h1>hello</h1>
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