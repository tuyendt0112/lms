import React, { memo, useState, useEffect } from "react";
import useDebounce from "hooks/useDebounce";
import { locations } from "ultils/constant";
import icons from "ultils/icons";
import { apiGetPitches } from "apis";
import {
    useNavigate,
    useParams,
    createSearchParams,
    useSearchParams,
} from "react-router-dom";
import path from "ultils/path";
const { AiOutlineDown } = icons;

const SearchItems = ({
    name,
    activeClick,
    changeActiveFilter,
    type = "checkbox",
}) => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { category } = useParams();
    const [selected, setSetSelected] = useState([]);
    const [bestPrice, setBestPrice] = useState(null);
    const [price, setPrice] = useState({
        from: "",
        to: "",
    });
    const handleSelect = (e) => {
        const alreadyEl = selected.find((el) => el === e.target.value);
        if (alreadyEl)
            setSetSelected((prev) => prev.filter((el) => el !== e.target.value));
        else setSetSelected((prev) => [...prev, e.target.value]);
        changeActiveFilter(null);
    };
    const fetchBestPricePitch = async () => {
        const response = await apiGetPitches({ sort: "-price", limit: 1 });
        if (response.success) setBestPrice(response.pitches[0]?.price);
    };
    const debouncePriceFrom = useDebounce(price.from, 500);
    const debouncePriceTo = useDebounce(price.to, 500);

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param) queries[i[0]] = i[1];
        if (selected.length > 0) {
            queries.address = selected.join(",");
            queries.page = 1;
        } else delete queries.address;
        // if (Number(price.from) > 0) queries.from = price.from;
        // if (Number(price.to) > 0) queries.from = price.to;
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [selected]);
    // debouncePriceFrom, debouncePriceTo
    //   console.log(selected);

    useEffect(() => {
        if (type === "input") fetchBestPricePitch();
    }, [type]);

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param) queries[i[0]] = i[1];
        if (Number(price.from) > 0) {
            queries.from = price.from;
        } else {
            delete queries.from;
        }
        if (Number(price.to) > 0) {
            queries.to = price.to;
        } else {
            delete queries.to;
        }
        queries.page = 1;
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [debouncePriceFrom, debouncePriceTo]);

    useEffect(() => {
        if (price.from && price.to)
            if (price.from > price.to)
                alert("From price cannot greater than To price");
    }, [price]);
    return (
        <div
            className="p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center rounded-md"
            onClick={() => changeActiveFilter(name)}
        >
            <span className="capitalize">{name}</span>
            <AiOutlineDown></AiOutlineDown>
            {activeClick === name && (
                <div className="absolute  z-10 top-[calc(100%+1px)] border left-0 w-fit p-4 bg-white min-w-[200px] ">
                    {type === "checkbox" && (
                        <div className="p-2">
                            <div className="p-4 items-center flex justify-between gap-8 border-b ">
                                <span className="text-main">{`${selected.length} selected`}</span>
                                <span
                                    className="underline cursor-pointer hover:text-main whitespace-nowrap"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSetSelected([]);
                                        changeActiveFilter(null);
                                    }}
                                >
                                    Reset
                                </span>
                            </div>
                            <div
                                className="flex flex-col gap-2 mt-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {locations.map((el, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                                            onChange={handleSelect}
                                            id={el}
                                            value={el}
                                            checked={selected.some(
                                                (selectedItem) => selectedItem === el
                                            )}
                                        />
                                        <label htmlFor={el} className="text-gray-700">
                                            {el}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {type === "input" && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 items-center flex justify-between gap-8 border-b">
                                <span className="whitespace-nowrap text-main">{`The highest price is ${Number(
                                    bestPrice
                                ).toLocaleString()} VNĐ `}</span>
                                <span
                                    className="underline cursor-pointer hover:text-main whitespace-nowrap"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPrice({ from: "", to: "" });
                                        changeActiveFilter(null);
                                    }}
                                >
                                    Reset
                                </span>
                            </div>
                            <div className="flex items-center p-2 gap-2 rou">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="from">From</label>
                                    <input
                                        className="form-input rounded-md"
                                        type="number"
                                        id="from"
                                        value={price.from}
                                        onChange={(e) =>
                                            setPrice((prev) => ({ ...prev, from: e.target.value }))
                                        }
                                    ></input>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="to">To</label>
                                    <input
                                        className="form-input rounded-md"
                                        type="number"
                                        id="to"
                                        value={price.to}
                                        onChange={(e) =>
                                            setPrice((prev) => ({ ...prev, to: e.target.value }))
                                        }
                                    ></input>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(SearchItems);
