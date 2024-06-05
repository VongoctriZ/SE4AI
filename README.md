Code tham khảo trên: youtube
full frontend fe: (1) https://www.youtube.com/watch?v=jbfuzcrfjqQ&t=7s

tham khảo reactjs: (2) https://www.youtube.com/watch?v=ONnlXF4mpIg&list=PLncHg6Kn2JT4C0enPGQPK7ZIlEoZ1ZvRy

Nên tìm hiểu sơ về HTML, CSS, JavaScript trong việc build web: (3) https://www.youtube.com/watch?v=QK7t5Aodgik

----------------------------------------------------------------------------------
- Môi trường code: VS Code
- Cách dùng: 
clone master branch về để chạy code trên VSCode 
(hướng dẫn ở video #3.2 ở list (2))
- Lưu ý: 
  + Đây là first commit nên tui push lên all file, về sau khi làm, chỉ nên push những file cần thay đổi
  + Khi commit phải có commit message
  + Đảm bảo code được commit phải chạy được
  + trường hợp muốn commit code bi lỗi lên, hãy đưa nó vào branch error
  + commit xong code thì update file README này như cấu trúc bên dưới.

----------------------------------------------------------------------------------
Update (5:25, 9/4/2024)
- Tiến độ hiện tại: 33' / 2h58'  video (1)
- Có tổ chức lại các thư mục như trong source code, nên chú ý khi tham khảo code video vào code gốc

----------------------------------------------------------------------------------
Update (19/04/2024)

- Hoàn thiện cơ bản front-end theo nguồn.

- Làm xong back-end trước ngày 22/04/2024.

---

Update 25/04/2024

backend:

extension:
- MongoDB
- Thunder Client

**Xong backend**
---
Update: 9h sáng 05/04/2024

Xây dựng admin

Các chức năng:
- Thêm sản phẩm
- Xem danh sách sản phẩm
- Kết nối với cơ sở dữ liệu và gửi thông tin sản phẩm lên.

---
Update 16h - 05/10/2024

- Full tutorial
- Login/SignUp/Admin/User/Cart


**Cách chạy web**
- Frontend: npm start
- Backend: npm start (nhớ kết nối mongodb)
- Admin: npm run dev

---
6h40 - 13/05/2024

Quy trình:
|Giao đoạn|Hoàn thành|Deadline|Công cụ|Phụ trách|
|-|-|-|-|-|
|Thiết kế UI/UX|Đang thực hiện|18/03/2024|Figma|Hân, Trí|
|Thiết kết Database|Hoàn thành|14/03/2024|MongoDB Compass/Atlas|Cường|
|Xây dựng API|Đang thực hiện|31/05/2024|NodeJS, Thunder Client|Cả nhóm|
|Xây dựng frontend|Đang thực hiện|31/05/2024|ReactJS,...|Huy, Hân, Trí|
|Xây dựng Admin, phân quyền|Đang thực hiện|31/05/2024|...|Huy, 
|Xây dựng AI use case|Chưa bắt đầu|31/05/2024|Python,...|Hân, Huy, Toàn|
|Kiểm thử|Chưa bắt đầu|03/06/2024|Thủ công|Cả nhóm|

---
25/05/2024

- Đã chia source code theo mô hình `MVC` (user, product, cart).
- Nhóm use-case về `account`: chưa thực hiện `reset password`.

---
**Trình bày trước lớp: 14/06/2024**

---

15:30 05/06/2024

cap nhat backend va frontend theo thiet ke moi cho Product

chi tiet:
- bug voi api popular for women and related products
- khi request san pham theo phan loai (men, women, kids), frontend render tam on, khong nhat thiet phai chia database Product thanh 3 phan. (Tại sao lại không cần thiết trong khi m có thể dễ kiếm soát và m duyệt nó nhanh hơn thay vì ngôi 800 cái ????, biết là dùng thư viện rồi nhưng sao ko chia lại gộp làm gì ????, sau này cả 5000 sản phẩm thì cũng ngồi duyệt à ???)
- trang hien thi san pham cho tung danh muc khon hien anh, chua tim ra bug
