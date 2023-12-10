import clsx from "clsx";
import React, { useState, useEffect, memo } from "react";
const ImageSlider = ({ imageArray, intervalMinutes, style }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Tăng chỉ số ảnh lên một và lặp lại nếu đã đến cuối mảng
            setCurrentImageIndex((prevIndex) =>
                prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
            );
        }, intervalMinutes * 60 * 1000); // chuyển đổi số phút sang milliseconds
        // Xóa interval khi component unmount
        return () => clearInterval(intervalId);
    }, [imageArray, intervalMinutes]);
    const currentImage = imageArray[currentImageIndex];
    return (

        <img src={currentImage} alt="poster" className={clsx('w-full object-cover', style)} />
    );
};

export default memo(ImageSlider);