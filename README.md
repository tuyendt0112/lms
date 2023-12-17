# finalprojectMERN
55: 
- Change role in Model user.js
- Change some code in verifyToken.js
- Create Loading.js in components (npm install react-spinners)
- Từ phút 24p39s đến 33p27s (chưa có file modal nên chưa làm loading.js, Nên coi thứ #48 từ 37p để hiểu thêm vào dispatch)
- Change code in Header.js (Profile)
- Change code in redux.js whitelist lưu thêm giá trị current
- getCurrent lấy role

56: 
- Chỉnh cấu trúc folder
- Chỉnh đường dẫn
- Thiết kế layout trang Admin

57: 
- Chỉnh hàm getUsers theo kiểu phân trang
- từ 16p40 là viết hàm tạo user (có thể không cần viết vì có thể tạo thằng trong MongoDB)
- Tạo thêm bảng role trong models
- Hiển thị user trong manage user
- Note: nhớ chỉnh fullwidth cho các inputfield trong trang login

58:
- Thêm Search Bar (InputFields) vào Manager User
- Chỉnh lại css cho InputFields
- Viết lại code để tìm kiếm bằng thanh search trong user.js (controller)

51: 
- Thêm pagination (phân trang) trong pitches.js
- New hook
- Fix bug nhỏ, sort theo bảng chữ cái bị ngược giá trị
- Hai file mới trong folder pagination
- Done pagination front-end

52: 
- Continue finish pagination (call API)
- Sửa một tí code trong file Pitches.js 
- Thêm hiệu ứng scroll up cho trang pitches
- Từ 41p là code về filter nhiều dữ liệu (trang hiện tại chỉ có filter theo giá) note lại để sau này nên xem lại để thêm filter cho trang
- Fix code cho filter theo price kết hợp với phân trang

59: 
- Tự fix bug nhỏ ở chỗ phân trang luôn hiện số 0 khi hiển thị lần đầu
- Cài đặt và sử dụng react-hook-form
- Từ 59p là validate cho trường mobile
- Gọi API updateUserbyAdmin, updateDeleteByAdmin trên client

60: 
- Hoàn thiện manage user (chọn role và block)

61: 
- Fix bug khi select 1 user để edit thì không load thông tin mới
- Model cũ nên chưa có brand, phần code brand cần xử lí sau 
- Hoàn thành phần 1 lấy dữ liệu từ form

52: 
- Fix lỗi undified khi login và lỗi trong console (add thêm middleware irgorne lỗi)

62: 
- Continue thêm sân bóng
- Install @tinymce/tinymce-react

63:
- Continue thêm sân bóng, xử lý dữ liệu ảnh 

64:
- Viết code lại phần upload ảnh lên Cloundary
- Gọi api tạo sản phẩm nối với form tạo sản phẩm
- npm install dompurify

Save :
- Loading 55 done
- Fix lỗi hiển thị rating khi nhấp vào sân mới
- Fix lỗi hiển thị ra 6 ngôi sao khi bình luận hiển thị 0.5
- Thêm avatar cho user
- Thêm updateAt cho rating
- Thêm populate cho hàm getPitch (để lấy tên user đã rating khi rating ref tới objectID của user)
- Fix tí UI cho thanh hiển thị số comment

65: 
- Layout quản lý sản phẩm
- Load dữ liệu từ db lên 

66: 
- Tiếp tục làm quản lý sản phẩm
- Fix bug pagination
- Fix bug search khi manage user và pitches

67:
- Fix tí bug UI cho manager user

68: 
- Từ 28p là chỉnh việc mất hình ảnh, tự fix theo code riêng


Note Fix Some Bug: 
- Fix Tự Sroll: xóa overflow-y-auto ở Public