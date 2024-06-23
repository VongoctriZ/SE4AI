Code tham khảo trên: youtube
full frontend fe: (1) https://www.youtube.com/watch?v=jbfuzcrfjqQ&t=7s

tham khảo reactjs: (2) https://www.youtube.com/watch?v=ONnlXF4mpIg&list=PLncHg6Kn2JT4C0enPGQPK7ZIlEoZ1ZvRy

Nên tìm hiểu sơ về HTML, CSS, JavaScript trong việc build web: (3) https://www.youtube.com/watch?v=QK7t5Aodgik

---

- Môi trường code: VS Code
- Cách dùng:
  clone master branch về để chạy code trên VSCode
  (hướng dẫn ở video #3.2 ở list (2))
- Lưu ý:
  - Đây là first commit nên tui push lên all file, về sau khi làm, chỉ nên push những file cần thay đổi
  - Khi commit phải có commit message
  - Đảm bảo code được commit phải chạy được
  - trường hợp muốn commit code bi lỗi lên, hãy đưa nó vào branch error
  - commit xong code thì update file README này như cấu trúc bên dưới.

---

Update (5:25, 9/4/2024)

- Tiến độ hiện tại: 33' / 2h58' video (1)
- Có tổ chức lại các thư mục như trong source code, nên chú ý khi tham khảo code video vào code gốc

---

Update (19/04/2024)

- Hoàn thiện cơ bản front-end theo nguồn.

- Làm xong back-end trước ngày 22/04/2024.

---

Update 25/04/2024

backend:

extension:

- MongoDB
- Thunder Client

## **Xong backend**

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

---

01:00 07/06/2024

Cap nhat frontend cho header va footer, dang cap nhat homepage view theo thiet ke moi

Chi tiet:

- Tao component moi la 'Header' thay the cho 'NavBar' truoc do, co anh dai dien cua nguoi dung (avatar), luc chua dang nhap thi avatar mac dinh, (nen sua thanh dang show-hide, nhung chua tim hieu nen hien tai la hard code bang cach de 1 avatar mac dinh cho nguoi dung chua dang nhap)
- Sua lai noi dung footer
- Home page vua tao duoc component 'SideBar' de dieu huong den cac trang san pham
- Home page can them anh san pham tieu bieu vao ben canh 'SideBar'

---

19:00 13/06/2024

- `npm install react-icons date-fns` trong muc frontend de hien thi rating

---

11:30 14/06/2024

- Hiện tại, các `use case` cơ bản của trang web đã hoàn thành (vẫn chưa tối ưu, nhưng đủ để demo).
- Tui sẽ làm thêm một chút về backend để xử lý data cho `AI use case`.

---

16/06/2024 - Update backend requirement
+ 9:45 
  - 'npm install express-validator' trong mục backend trước khi chạy.
+ 14:45
  - update profile info page UI, chưa đồng bộ đc avatar, có lẽ cần backend đoạn này  

---

16/06/2024

Task cuoi cung

- AI: de xuat cho 1 user cu the
  - Chon mo hinh nhe nhat
  - Chuan bi data
  - Tao api va frontend tuong tu `Best Sellers`
  - Deadline: 5 ngay ---> (21/06/2024)
  - Phu trach: ca nhom (ngoai tru Huy)

- Use case: thanh toan
  - Deadline: 2 ngay
  - Phu trach: Huy

---
22:35 19/06/2024

- cap nhat use case Add Product trong admin: hosting anh bang imgur (online) thay vi tren may local
  - cac link huong dan di kem (khong quan trong nen tui ko ghi chi tiet, khi nao can se trinh bay sau):
    - [How To Get Imgur API Key](https://www.youtube.com/watch?v=Xu8zhInwn8A)
    - [Postman](https://www.postman.com/)
    - [imgur](https://imgur.com/)
  - Anh da test:
    - name: ml
    - category: men
    - *anh dau tien khi sort by date*
  

---
  
  - New mission: (22h40-T6-21-06-2024)
  - Toàn/Cường/Trí: Cải tiến và tìm thêm model.
  - Huy: Tạo sinh data, re-train.
  - Hân: Test trang web và đọc yêu cầu của PA để thảo luận với nhóm.

---

23:30 23/06/2024

- Cap nhat tien do:
  - Model AI (svd)
    - output cai thien sau khi huan luyen tren 7000 do hang.