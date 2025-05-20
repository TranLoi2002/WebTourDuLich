import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom"; // Thêm import Link
import "swiper/css";
import "swiper/css/navigation";


const parseBotResponse = (response) => {
    const tours = [];
    // Regex cập nhật để tách title và id
    const tourRegex = /⭐ Tour: (.*?)\s*\(ID: (\d+)\)\n📍 Địa điểm: (.*?)\n💬 Mô tả: (.*?)(?=\n💵 Giá:|\n⭐ Tour:|$)/gs;

    let match;
    while ((match = tourRegex.exec(response)) !== null) {
        const [_, title, id, location, description] = match;
        tours.push({
            id: id.trim(), // Lưu ID riêng
            title: title.trim(), // Chỉ lấy tên tour
            location: location.trim(),
            description: description.trim(),
        });
    }

    return tours;
};

const formatNormalResponse = (response) => {
    // Xử lý Markdown
    let processedResponse = response;

    // 1. Liên kết [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    processedResponse = processedResponse.replace(markdownLinkRegex, (match, text, url) => {
        const relativePath = new URL(url).pathname;
        return `<Link to="${relativePath}">${text}</Link>`;
    });

    // 2. Tiêu đề Markdown (#, ##, ###)
    processedResponse = processedResponse.replace(/^(#{1,3})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length; // 1, 2, hoặc 3
        return `<h${level} class="text-gray-800 font-semibold mt-2 mb-1">${text}</h${level}>`;
    });

    // 3. Danh sách Markdown (- item)
    processedResponse = processedResponse.replace(/^\s*-\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
    // Bọc danh sách trong <ul> (xử lý thủ công để tránh lặp)
    processedResponse = processedResponse.replace(/(<li class="ml-4 list-disc">.+<\/li>)+/g, '<ul>$&</ul>');

    // 4. Xóa ** (in đậm)
    processedResponse = processedResponse.replace(/\*\*/g, "");

    // Chia thành các dòng
    const lines = processedResponse.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line, index) => (
        <div
            key={index}
            className="text-gray-700 mb-2"
            dangerouslySetInnerHTML={{
                __html: line
                    // Chuyển <Link> thành <a> cho dangerouslySetInnerHTML
                    .replace(/<Link to="([^"]+)">([^<]+)<\/Link>/g,
                        '<a href="$1" class="text-blue-600 hover:underline">$2</a>'
                    ),
            }}
        />
    ));
};

const ChatbotResponse = ({ response }) => {
    const tours = parseBotResponse(response);
    // console.log("Parsed tours:", tours); // Để debug

    const isMarkdown = response.includes("*") || response.includes("_") || response.includes("[") || response.includes("]");

    if (tours.length > 0) {
        return (
            <Swiper
                key={tours.length}
                spaceBetween={30}
                slidesPerView="auto"
                slidesPerGroup={1}
                navigation={true}
                modules={[Navigation]}
                className="swiper-tour-layout"
                style={{ width: "100%" }}
            >
                {tours.map((tour, index) => (
                    <SwiperSlide key={index} style={{ width: "300px" }} className="rounded-2xl border-2 shadow-2xl my-4">
                        <div className="p-4">
                            <Link
                                to={`/tours/detailtour/${tour.id}`}
                                className="font-bold text-blue-600 hover:underline"
                            >
                                {tour.title}
                            </Link>
                            <p className="text-sm text-gray-500 mb-2">{tour.location}</p>
                            <p
                                className="text-base max-w-2xl text-shadow-sm"
                                data-swiper-parallax="-100"
                                dangerouslySetInnerHTML={{
                                    __html: tour.description.length > 200
                                        ? `${tour.description.slice(0, 200)}...`
                                        : tour.description,
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    } else if (response.includes("error") || response.includes("Error")) {
        return <div className="text-gray-700">{formatNormalResponse(response)}</div>;
    } else {
        return <div className="text-gray-700">{formatNormalResponse(response)}</div>;
    }
};

export default ChatbotResponse;